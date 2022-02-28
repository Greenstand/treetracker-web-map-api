
class SQLTree {

  setTreeId(treeId) {
    this.treeId = treeId;
  }

  setTreeName(treeName) {
    this.treeName = treeName;
  }

  setToken(token) {
    this.token = token;
  }

  getQuery() {
    if (!this.treeId && !this.treeName && !this.token) {
      throw new Error("treeId or treeName or token required");
    }

    const query = {
      text: `
        SELECT
          trees.*,
          tree_species.name AS species_name,
          planter.first_name AS first_name, planter.last_name as last_name,
          planter.image_url AS user_image_url,
          token.id::text AS token_uuid,
          wallet.name as wallet
        FROM
          trees
        INNER JOIN planter
        ON planter.id = trees.planter_id
        LEFT JOIN tree_species ON
          trees.species_id = tree_species.id
        LEFT JOIN wallet.token token ON token.capture_id::text = trees.uuid
        LEFT JOIN wallet.wallet wallet ON wallet.id = token.wallet_id 
        WHERE
        true 
        ${this.getFilter()}
        AND trees.active = true
      `,
      values: [],
    };
    console.log("tree:", query);
    return query;
  }

  getFilter() {
    let filter = "";
    if (this.treeId) {
      filter += `AND trees.id = ${this.treeId}`;
    }
    if (this.treeName) {
      filter += `AND trees.name = '${this.treeName}'`;
    }
    if (this.token) {
      filter += `AND token.id = '${this.token}'`;
    }
    return filter;
  }

  setTreeUUID(uuid) {
    this.treeUUID = uuid;
  }

  getQueryUUID() {
    if (!this.treeUUID) {
      throw new Error("treeUUID required");
    }

    const query = {
      text: `
        SELECT
          trees.*,
          tree_species.name AS species_name,
          planter.first_name AS first_name, planter.last_name as last_name,
          planter.image_url AS user_image_url,
          token.id::text AS token_uuid,
          wallet.name as wallet
        FROM
          trees
        INNER JOIN planter
        ON planter.id = trees.planter_id
        LEFT JOIN tree_species ON
          trees.species_id = tree_species.id
        LEFT JOIN wallet.token token ON token.capture_id::text = trees.uuid
        LEFT JOIN wallet.wallet wallet ON wallet.id = token.wallet_id 
        WHERE
          trees.uuid = $1 AND trees.active = true
      `,
      values: [this.treeUUID],
    };
    console.log("tree:", query);
    return query;
  }
}

module.exports = SQLTree;
