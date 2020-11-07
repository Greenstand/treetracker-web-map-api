const { Pool} = require('pg');
const config = require('../config/config');


class Map{
  constructor(){
    this.pool = new Pool({ connectionString: config.connectionString });
  }

  async init(settings){
    console.debug("init map with settings:", settings);
    this.clusterRadius = settings.clusterRadius;
    this.token = settings.token;
    this.flavor = settings.flavor;
    this.treeid = settings.treeid;
    this.userid = settings.userid;
    this.wallet = settings.wallet;
    this.mapName = settings.map_name;
    this.bounds = settings.bounds;
    this.clusterRadius = parseFloat(settings.clusterRadius);
    this.zoomLevel = parseInt(settings.zoom_level);
    this.treeIds = [];
    if(this.mapName){
      console.log("try to get the trees in organization");
      const sql = 
        `
          select id from trees where 
          planter_id in (
            select id from planter where organization_id in (select entity_id from getEntityRelationshipChildren(
              (select id from entity where map_name = '${this.mapName}')
            ))
          )
          or 
          trees.planting_organization_id  in (
          select entity_id from getEntityRelationshipChildren(
              (select id from entity where map_name = '${this.mapName}')
          )
          )
          `;
      const query = {
        text: sql,
        values: []
      };
      const r = await this.pool.query(query);
      console.log("trees:", r.rows.length);
      r.rows.forEach(e => this.treeIds.push(e.id) );
      
      /*
       * If no trees in this org, then build a case that filter out all trees!
       */
      if(this.treeIds.length === 0){
        this.treeIds = [-1]; //this is impossible to match a tree which id is -1
      }
    }

  }

  async getQuery(){
    let select = '';
    let join = '';
    let joinCriteria = '';
    let filter = '';
    let subset = false;
    let treeCount = 0;
    if (this.token) {
      join = "INNER JOIN certificates ON trees.certificate_id = certificates.id AND certificates.token = '" + this.token + "'";
      subset = true;
    } else if (this.flavor) {
      join = "INNER JOIN tree_attributes ON tree_attributes.tree_id = trees.id";
      joinCriteria = "AND tree_attributes.key = 'app_flavor' AND tree_attributes.value = '" + this.flavor + "'";
      subset = true;
    } else if(this.treeid) {
      filter = 'AND trees.id = ' + this.treeid + ' '
  //    if(treeIds && treeIds.length > 0){
  //      filter += 'AND trees.id in (' + treeIds.join(',') + ') '
  //    }
      subset = true;
    } else if(this.userid) {
      //count the trees first
      const result = await this.pool.query({
        text: `select count(*) as count from trees where planter_id = ${this.userid}`,
        values:[]
      });
      treeCount = result.rows[0].count;
      parseInt(treeCount);

      filter = 'AND trees.planter_id = ' + this.userid + ' '
      subset = true;
    } else if(this.wallet) {
      select = ', token.uuid AS token_uuid '
      join = 'INNER JOIN token ON token.tree_id = trees.id'
      join += ' INNER JOIN entity ON entity.id = token.entity_id'
      filter = "AND entity.wallet = '" + this.wallet + "'"
      subset = true
    }

    let boundingBoxQuery = '';
    let clusterBoundingBoxQuery = '';
    if (this.bounds) {
      boundingBoxQuery = 'AND trees.estimated_geometric_location && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
      clusterBoundingBoxQuery = 'AND location && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
      console.log(this.bounds);
    }

    var sql;

    if (this.zoomLevel > 15 || this.treeid != null ) {

      sql = `
      /* case2 */
      SELECT DISTINCT ON(trees.id)
      'point' AS type,
       trees.*, planter.first_name as first_name, planter.last_name as last_name,
      planter.image_url as user_image_url `
      + select + `
      FROM trees `
      + join + `
      INNER JOIN planter
      ON planter.id = trees.planter_id
      LEFT JOIN note_trees
      ON note_trees.tree_id = trees.id
      LEFT JOIN notes
      ON notes.id = note_trees.note_id
      WHERE active = true ` + boundingBoxQuery + filter + joinCriteria + 
      `${this.treeIds && this.treeIds.length > 0 ?
        " and trees.id in(" + this.treeIds.join(",") + ") "
        :
        " "
      }`
      ;
      console.log(sql);

      this.query = {
        text: sql
      };
    } else if (subset) {
      if(this.userid && treeCount > 2000){
        console.log("Too many tress %d for userid, use active tree region", treeCount);
        this.query = {
          text: `
            /* case5 */
            select
              'cluster' as type,
              region_id id,
              ST_ASGeoJson(centroid) centroid,
              type_id as region_type,
              count(tree_region.id)
            from
              active_tree_region tree_region
            join trees on
              tree_region.tree_id = trees.id
            where
              zoom_level = $1
              and planter_id = ${this.userid}
            group by
              region_id,
              centroid,
              type_id
              `,
          values: [this.zoom_level]
        };
      }else{
        console.log('Calculating clusters directly');
        sql = `
          /* case3 */
          SELECT 'cluster'                                           AS type,
           St_asgeojson(St_centroid(clustered_locations))                 centroid,
           St_numgeometries(clustered_locations)                          count
          FROM   (
           SELECT Unnest(St_clusterwithin(estimated_geometric_location, $1)) clustered_locations
           FROM   trees ` + join + `
           WHERE  active = true ` + boundingBoxQuery + filter + joinCriteria + ` ) clusters`;
        this.query = {
          text: sql,
          values: [this.clusterRadius]
        };
      }


      /*
      var boundingBoxQuery = "";
      if( bounds ) {
        boundingBoxQuery = ' AND centroid && ST_MakeEnvelope(' + bounds + ', 4326) ';
      }
      query = {
        text: `SELECT 'cluster' AS type,
        region_id id, ST_ASGeoJson(centroid) centroid,
        type_id as region_type,
        count(id)
        FROM active_tree_region tree_region
        WHERE zoom_level = $1
        ${boundingBoxQuery}
        GROUP BY region_id, centroid, type_id`,
        values: [req.query['zoom_level']]
      };
      */

    } else if ([12, 13, 14, 15].includes(this.zoomLevel) && !this.mapName) {

      console.log('Using cluster cache from zoom level 14  for zoom level ' + this.zoomLevel);
      sql = `
            /* case4 */
            SELECT 'cluster' as type,
             St_asgeojson(location) centroid, count
             FROM clusters
             WHERE zoom_level = 14 ${clusterBoundingBoxQuery}`
      this.query = {
        text: sql
      }

    } else {

      boundingBoxQuery = "";
      if( this.bounds ) {
        boundingBoxQuery = ' AND centroid && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
      }

      this.query = {
        text: `
        /* case1 */
        SELECT 'cluster' AS type,
        region_id id, ST_ASGeoJson(centroid) centroid,
        type_id as region_type,
        count(id)
        FROM active_tree_region tree_region
        WHERE zoom_level = $1
        ${this.treeIds && this.treeIds.length > 0 ?
          "and tree_region.tree_id in(" + this.treeIds.join(",") + ")"
          :
          ""
        }
        ${boundingBoxQuery}
        GROUP BY region_id, centroid, type_id`,
        values: [this.zoomLevel]
      };

    }
    return this.query;
  }

  async getZoomTargetQuery(){
    // if we are in zoom level 9 or less
    // get the biggest cluster within each region
    // at a higher zoom level after zooming (zoom in moves 2 zoom levels ) 
    if(this.zoomLevel <= 9){
      console.log('get zoom targets data');


      let boundingBoxQuery = "";
      if( this.bounds ) {
        boundingBoxQuery = ' AND region.centroid && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
      }

      const zoomTargetsQuery = {
        text: `SELECT DISTINCT ON (region.id)
                region.id region_id,
                contained.region_id most_populated_subregion_id,
                contained.total,
                contained.zoom_level,
                ST_ASGeoJson(contained.centroid) centroid
                FROM
                 (
                  SELECT region_id, zoom_level
                  FROM active_tree_region
                  WHERE zoom_level = $1
                  ${this.treeIds && this.treeIds.length > 0 ?
                      "and active_tree_region.tree_id in(" + this.treeIds.join(",") + ")"
                      :
                      ""
                  }
                  GROUP BY region_id, zoom_level
                 ) populated_region
                JOIN region
                ON region.id = populated_region.region_id
                JOIN (
                  SELECT region_id, zoom_level, count(active_tree_region.id) AS total, centroid
                  FROM active_tree_region
                  WHERE zoom_level = $2
                  ${this.treeIds && this.treeIds.length > 0 ?
                      "and active_tree_region.tree_id in(" + this.treeIds.join(",") + ")"
                      :
                      ""
                  }
                  GROUP BY region_id, zoom_level, centroid
                ) contained
                ON ST_CONTAINS(region.geom, contained.centroid)
                WHERE true ${boundingBoxQuery}
                ORDER BY region.id, total DESC`,
        values: [this.zoomLevel, this.zoomLevel + 2]
      }
      console.log(zoomTargetsQuery);
      return zoomTargetsQuery;
    }else{
      return;
    }
  }

  async getPoints(){
  }

  async getZoomTarget(){
  }
}

module.exports = Map;
