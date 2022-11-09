/*
 * Case1, search DB via active_tree_region table,
 * V2, use join to filter organization trees
 */
const SQLCase1 = require("./SQLCase1");

class SQLCase1V2 extends SQLCase1{

  constructor(){
    super();
  }

  getJoin(){
    let result = "";
    if(this.isFilteringByUserId){
      result += "JOIN trees ON tree_region.tree_id = trees.id";
    }
    if(this.mapName){
      result += `
        INNER JOIN
        (  select trees.id as org_tree_id from trees
          where trees.planter_id in (
            SELECT id FROM planter
            JOIN (
              SELECT entity_id FROM getEntityRelationshipChildren(
                (SELECT id FROM entity WHERE map_name = '${this.mapName}')
              )
            ) org ON planter.organization_id = org.entity_id
          ) OR 
              trees.planting_organization_id = (
                select id from entity where map_name = '${this.mapName}'
              )
        ) tree_ids
        ON tree_region.tree_id = tree_ids.org_tree_id`;
    }
    return result;
  }

  addMapNameFilter(mapName){
    this.mapName = mapName;
  }

}

module.exports = SQLCase1V2;
