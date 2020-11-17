
class SQLTree{

  setTreeId(treeId){
    this.treeId = treeId;
  }

  getQuery(){
    if(!this.treeId){
      throw new Error("treeId required");
    }

    return {
      text: `
        SELECT
          trees.*,
          tree_species.name AS species_name
        FROM
          trees
        LEFT JOIN tree_species ON
          trees.species_id = tree_species.id
        WHERE
          trees.id = $1
      `,
      values: [this.treeId],
    };
  }
}

module.exports = SQLTree;
