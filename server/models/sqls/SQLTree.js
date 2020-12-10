
class SQLTree{

  setTreeId(treeId){
    this.treeId = treeId;
  }

  getQuery(){
    if(!this.treeId){
      throw new Error("treeId required");
    }

    const query = {
      text: `
        SELECT
          trees.*,
          tree_species.name AS species_name,
          planter.first_name AS first_name, planter.last_name as last_name,
          planter.image_url AS user_image_url,
          token.uuid AS token_uuid,
          entity.wallet as wallet
        FROM
          trees
        INNER JOIN planter
        ON planter.id = trees.planter_id
        LEFT JOIN tree_species ON
          trees.species_id = tree_species.id
        LEFT JOIN token ON token.tree_id = trees.id 
        LEFT JOIN entity ON entity.id = token.entity_id 
        WHERE
          trees.id = $1 AND trees.active = true
      `,
      values: [this.treeId],
    };    
    console.log("tree:", query);
    return query;
  }
}

module.exports = SQLTree;
