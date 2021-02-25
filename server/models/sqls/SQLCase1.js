/*
 * Case1, search DB via active_tree_region table,
 */

class SQLCase1{

  constructor(){
    this.isFilteringByUserId = false;
    this.userId = undefined;
  }

  addFilterByUserId(userId){
    this.isFilteringByUserId = true;
    this.userId = userId;
  }

  getJoin(){
    let result = "";
    if(this.isFilteringByUserId){
      result += "JOIN trees ON tree_region.tree_id = trees.id";
    }
    return result;
  }

  getFilter(){
    let result = "";
    if(this.isFilteringByUserId){
      result += "AND planter_id = " + this.userId + " ";
    }
    if(this.treeIds && this.treeIds.length > 0){
      result += "AND tree_region.tree_id IN(" + this.treeIds.join(",") + ") ";
    }
    if(this.mapName){
      result += `
        AND tree_region.tree_id IN(
          select distinct * from ( 
            SELECT trees.id as id from trees
              INNER JOIN (
                SELECT id FROM planter
                JOIN (
                  SELECT entity_id FROM getEntityRelationshipChildren(
                    (SELECT id FROM entity WHERE map_name = '${this.mapName}')
                  )
                ) org ON planter.organization_id = org.entity_id
              ) planter_ids
              ON trees.planter_id = planter_ids.id
          union all 
            SELECT trees.id as id from trees
              INNER JOIN (
                SELECT id FROM planter
                JOIN (
                  SELECT entity_id FROM getEntityRelationshipChildren(
                    (SELECT id FROM entity WHERE map_name = '${this.mapName}')
                  )
                ) org ON planter.organization_id = org.entity_id
              ) planter_ids
              ON trees.planter_id = planter_ids.id
          ) t1
        )
      `;
    }
    return result;
  }

  setZoomLevel(zoomLevel){
    this.zoomLevel = zoomLevel;
  }

  getZoomLevel(){
    if(!this.zoomLevel){
      throw new Error("zoom level required");
    }
    return this.zoomLevel;
  }

  setBounds(bounds){
    this.bounds = bounds;
  }

  getBoundingBoxQuery(){
    let result = "";
    if (this.bounds) {
      result += ' AND centroid && ST_MakeEnvelope(' + this.bounds + ', 4326) \n';
    }
    return result;
  }

  addMapNameFilter(mapName){
    this.mapName = mapName;
  }

  getQuery(){
    //TODO check the conflict case, like: can not set userid and treeIds at the same time
    const query = {
      text: `
      /* sql case1 */
      SELECT 'cluster' AS type,
      region_id id, ST_ASGeoJson(centroid) centroid,
      type_id as region_type,
      count(tree_region.id)
      FROM active_tree_region tree_region
      ${this.getJoin()}
      WHERE zoom_level = $1
      ${this.getFilter()}
      ${this.getBoundingBoxQuery()}
      GROUP BY region_id, centroid, type_id`,
      values: [this.getZoomLevel()]
    };
    return query;
  }
}

module.exports = SQLCase1;
