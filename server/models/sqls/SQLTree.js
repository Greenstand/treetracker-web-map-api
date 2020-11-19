
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
          tree_species.name AS species_name,
          planter.first_name as first_name, planter.last_name as last_name,
          planter.image_url as user_image_url 
        FROM
          trees
        INNER JOIN planter
        ON planter.id = trees.planter_id
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
