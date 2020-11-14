const SQLTree = require("./sqls/SQLTree");
const { Pool} = require('pg');
const config = require('../config/config');

class Tree{
  constructor(){
    this.pool = new Pool({ connectionString: config.connectionString });
  }

  async getTreeById(treeId){
    const sql = new SQLTree();
    sql.setTreeId(treeId);
    const query = await sql.getQuery();
    const result = await this.pool.query(query);
    return result;
  }
}


module.exports = Tree;
