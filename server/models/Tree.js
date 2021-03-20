const SQLTree = require("./sqls/SQLTree");
const { Pool} = require('pg');

class Tree{
  constructor(){
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getTreeById(treeId){
    const sql = new SQLTree();
    sql.setTreeId(treeId);
    const query = await sql.getQuery();
    const result = await this.pool.query(query);
    if(result.rows.length === 0){
      throw new Error("can not find tree", treeId);
    }
    const treeObject = result.rows[0];
    //attribute
    {
      const query = {
        text: "select * from tree_attributes where tree_id = $1",
        values: [treeId],
      };
      const attributes = await this.pool.query(query);
      const attributeJson = {};
      for(const r of attributes.rows){
        attributeJson[r.key] = r.value;
      }
      treeObject.attributes = attributeJson;
    }
    return treeObject;
  }

  async getTreeByUUID(uuid){
    const sql = new SQLTree();
    sql.setTreeUUID(uuid);
    const query = await sql.getQueryUUID();
    const result = await this.pool.query(query);
    if(result.rows.length === 0){
      throw new Error("can not find tree", treeId);
    }
    const treeObject = result.rows[0];
    //attribute
    {
      const query = {
        text: "select * from tree_attributes where tree_id = $1",
        values: [treeObject.id],
      };
      console.log(query)
      const attributes = await this.pool.query(query);
      const attributeJson = {};
      for(const r of attributes.rows){
        attributeJson[r.key] = r.value;
      }
      treeObject.attributes = attributeJson;
    }
    return treeObject;
  }
}


module.exports = Tree;
