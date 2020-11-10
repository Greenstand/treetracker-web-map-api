
class SQLCase2{
  

  addTreeFilter(treeid){
    this.treeid = treeid;
  }

  getFilter(){
    let result;
    if(this.treeid){
      result = 'AND trees.id = ' + this.treeid + ' '
    }
    return result;
  }

  getQuery(){
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
      WHERE active = true ` /* + boundingBoxQuery*/ + this.getFilter() /*+ joinCriteria + */ 
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
