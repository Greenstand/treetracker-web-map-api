/*
 * Case6, to search cluster for next zoom target
 * V2, use select to get trees in organzaion rather then an explicit tree id list
 */
const SQLZoomTargetCase1 = require("./SQLZoomTargetCase1");

class SQLZoomTargetCase1V2 extends SQLZoomTargetCase1{

  constructor(){
    super();
  }

  addMapNameFilter(mapName){
    this.mapName = mapName;
  }

  setTreeIds(){
    throw new Error("dedicated");
  }


  getFilter(){
    let result = "";
    if(this.mapName){
      result += `
        AND active_tree_region.tree_id IN(
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
        )`;
    }
    return result;
  }

  addTreesFilter(){
    throw new Error("dedicated");
  }

}

module.exports = SQLZoomTargetCase1V2;
