var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var pg = require('pg');
const { Pool, Client } = require('pg');
var path = require('path');
var app = express();
var config = require('./config/config');
const Sentry = require('@sentry/node');

const pool = new Pool({ connectionString: config.connectionString });
Sentry.init({ dsn: config.sentryDSN });

app.use(Sentry.Handlers.requestHandler());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.set('view engine', 'html');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

if(process.env.NODE_ENV == 'dev'){
  app.use(allowCrossDomain);
}

//app.get(/(\/api\/web)?\/trees/, function (req, res) {
app.get("/trees", async function (req, res) {
    try{
  //console.log(req);

  let token = req.query['token'];
  let flavor = req.query['flavor'];
  let treeid = req.query['treeid'];
  let userid = req.query['userid'];
  let wallet = req.query['wallet'];
  let mapName = req.query['map_name'];
  console.log("mapName:", mapName);
  let treeIds = [];
  if(mapName){
      console.log("try to get the trees in organization");
      const sql = 
        `
        select id from trees where 
        planter_id in (
          select id from planter where organization_id in (select entity_id from getEntityRelationshipChildren(
            (select id from entity where map_name = '${mapName}')
          ))
        )
        or 
        trees.planting_organization_id  in (
        select entity_id from getEntityRelationshipChildren(
            (select id from entity where map_name = '${mapName}')
        )
        )
        `;
      query = {
        text: sql,
        values: []
      };
      const r = await pool.query(query);
      console.log("trees:", r.rows.length);
      r.rows.forEach(e => treeIds.push(e.id) );
  }

  let select = '';
  let join = '';
  let joinCriteria = '';
  let filter = '';
  let subset = false;
  let treeCount = 0;
  if (token) {
    join = "INNER JOIN certificates ON trees.certificate_id = certificates.id AND certificates.token = '" + token + "'";
    subset = true;
  } else if (flavor) {
    join = "INNER JOIN tree_attributes ON tree_attributes.tree_id = trees.id";
    joinCriteria = "AND tree_attributes.key = 'app_flavor' AND tree_attributes.value = '" + flavor + "'";
    subset = true;
  } else if(treeid) {
    filter = 'AND trees.id = ' + treeid + ' '
//    if(treeIds && treeIds.length > 0){
//      filter += 'AND trees.id in (' + treeIds.join(',') + ') '
//    }
    subset = true;
  } else if(userid) {
    //count the trees first
    const result = await pool.query({
      text: `select count(*) as count from trees where planter_id = ${userid}`,
      values:[]
    });
    treeCount = result.rows[0].count;
    parseInt(treeCount);

    filter = 'AND trees.planter_id = ' + userid + ' '
    subset = true;
  } else if(wallet) {
    select = ', token.uuid AS token_uuid '
    join = 'INNER JOIN token ON token.tree_id = trees.id'
    join += ' INNER JOIN entity ON entity.id = token.entity_id'
    filter = "AND entity.wallet = '" + wallet + "'"
    subset = true
  }

  let bounds = req.query['bounds'];
  let boundingBoxQuery = '';
  let clusterBoundingBoxQuery = '';
  if (bounds) {
    boundingBoxQuery = 'AND trees.estimated_geometric_location && ST_MakeEnvelope(' + bounds + ', 4326) ';
    clusterBoundingBoxQuery = 'AND location && ST_MakeEnvelope(' + bounds + ', 4326) ';
    console.log(bounds);
  }

  let clusterRadius = parseFloat(req.query['clusterRadius']);
  console.log(clusterRadius);
  var sql, query
  const zoomLevel = parseInt(req.query['zoom_level']);
  console.log("zoom level " + zoomLevel);
  if (zoomLevel > 15 || treeid != null ) {

    sql = `SELECT DISTINCT ON(trees.id)
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
    `${treeIds && treeIds.length > 0 ?
      " and trees.id in(" + treeIds.join(",") + ") "
      :
      " "
    }`
    ;
    console.log(sql);

    query = {
      text: sql
    };
  } else if (subset) {
    if(userid && treeCount > 2000){
      console.log("Too many tress %d for userid, use active tree region", treeCount);
      query = {
        text: `
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
            and planter_id = ${userid}
          group by
            region_id,
            centroid,
            type_id
            `,
        values: [req.query['zoom_level']]
      };
    }else{
      console.log('Calculating clusters directly');
      sql = `SELECT 'cluster'                                           AS type,
         St_asgeojson(St_centroid(clustered_locations))                 centroid,
         St_numgeometries(clustered_locations)                          count
        FROM   (
         SELECT Unnest(St_clusterwithin(estimated_geometric_location, $1)) clustered_locations
         FROM   trees ` + join + `
         WHERE  active = true ` + boundingBoxQuery + filter + joinCriteria + ` ) clusters`;
      query = {
        text: sql,
        values: [clusterRadius]
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

  } else if ([12, 13, 14, 15].includes(zoomLevel) && !mapName) {

    console.log('Using cluster cache from zoom level 14  for zoom level ' + zoomLevel);
    sql = `SELECT 'cluster' as type,
           St_asgeojson(location) centroid, count
           FROM clusters
           WHERE zoom_level = 14 ${clusterBoundingBoxQuery}`
    query = {
      text: sql
    }
    console.log(query);

  } else {

    console.log(zoomLevel);
    boundingBoxQuery = "";
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
      ${treeIds && treeIds.length > 0 ?
        "and tree_region.tree_id in(" + treeIds.join(",") + ")"
        :
        ""
      }
      ${boundingBoxQuery}
      GROUP BY region_id, centroid, type_id`,
      values: [req.query['zoom_level']]
    };

  }

  console.log(query);
  await pool.query(query)
    .then(function (data) {
      console.log('query ok');
      console.log(data.rows.slice(0,2))

      // if we are in zoom level 9 or less
      // get the biggest cluster within each region
      // at a higher zoom level after zooming (zoom in moves 2 zoom levels ) 
      if(zoomLevel <= 9){
        console.log('get zoom targets data');


        boundingBoxQuery = "";
        if( bounds ) {
          boundingBoxQuery = ' AND region.centroid && ST_MakeEnvelope(' + bounds + ', 4326) ';
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
                  GROUP BY region_id, zoom_level
                 ) populated_region
                JOIN region
                ON region.id = populated_region.region_id
                JOIN (
                  SELECT region_id, zoom_level, count(active_tree_region.id) AS total, centroid
                  FROM active_tree_region
                  WHERE zoom_level = $2
                  ${treeIds && treeIds.length > 0 ?
                    "and active_tree_region.tree_id in(" + treeIds.join(",") + ")"
                    :
                    ""
                  }
                  GROUP BY region_id, zoom_level, centroid
                ) contained
                ON ST_CONTAINS(region.geom, contained.centroid)
                WHERE true ${boundingBoxQuery}
                ORDER BY region.id, total DESC`,
          values: [zoomLevel, zoomLevel + 2]
        }
        console.log(zoomTargetsQuery);
        pool.query(zoomTargetsQuery)
          .then(function (zoomTargetsData) {
            console.log('got zoom targets data');
            res.status(200).json({
              data: data.rows,
              zoomTargets: zoomTargetsData.rows
            })
          })
          .catch(function(error) {
            console.log('query not ok');
            console.log(error);
            throw(error);
          });

      } else {

        res.status(200).json({
          data: data.rows
        })

      }
    })
    .catch(function(error) {
      console.log('query not ok');
      console.log(error);
      throw(error);
    });


    }catch(e){
      console.error(e);
    }
});

app.use(Sentry.Handlers.errorHandler());

//entities API
const entity = require("./api/entity");
//app.use(/(\/api\/web)?\/entities/, entity);
app.use("/entities", entity);

//nearest API
const nearest = require("./api/nearest");
app.use("/nearest", nearest);

//add static files, HTML pages
app.use(express.static(path.join(__dirname, "../client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

//app.listen(port, () => {
//  console.log('listening on port ' + port);
//});
module.exports = app;
