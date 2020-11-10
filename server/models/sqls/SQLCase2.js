/*
 * Search DB by trees table directly, like in the high zoom level, show trees
 * on the map;
 */

class SQLCase2{
  

  addTreeFilter(treeid){
    this.treeid = treeid;
  }

  addTreesFilter(treeIds){
    this.treeIds = treeIds;
  }

  addFilterByUserId(userId){
    this.userId = userId;
  }

  getFilter(){
    let result = "";
    if(this.treeid){
      result += 'AND trees.id = ' + this.treeid + ' \n';
    }
    if(this.treeIds && this.treeIds.length > 0){
      result += "AND trees.id IN(" + this.treeIds.join(",") + ") ";
    }
    if(this.userId){
      result += "AND trees.planter_id = " + this.userId + " \n";
    }
    return result;
  }

  setBounds(bounds){
    this.bounds = bounds;
  }

  getBoundingBoxQuery(){
    let result = "";
    if (this.bounds) {
      result += 'AND trees.estimated_geometric_location && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
    }
    return result;
  }

  getJoinCriteria(){
    //TODO
    return "";
  }

  check(){
    if(!this.bounds && !this.treeid && !this.treeIds && !this.userId){
      throw new Error("please narrow down the data set");
    }
  }

  getQuery(){
    this.check();
    let sql = `
      /* sql case2 */
      SELECT DISTINCT ON(trees.id)
      'point' AS type,
       trees.*, planter.first_name as first_name, planter.last_name as last_name,
      planter.image_url as user_image_url `
      + /*select + */ `
      FROM trees `
      + /*join +*/ `
      INNER JOIN planter
      ON planter.id = trees.planter_id
      LEFT JOIN note_trees
      ON note_trees.tree_id = trees.id
      LEFT JOIN notes
      ON notes.id = note_trees.note_id
      WHERE active = true 
      ${this.getBoundingBoxQuery()}
      ${this.getFilter()}
      ${this.getJoinCriteria()}
    ` 
//      `${this.treeIds && this.treeIds.length > 0 ?
//          " and trees.id in(" + this.treeIds.join(",") + ") "
//          :
//          " "
//      }`
    ;
    console.log(sql);

    const query = {
      text: sql,
      values: [],
    };
    return query;
  }
}


module.exports = SQLCase2;
