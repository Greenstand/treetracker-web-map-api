
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
        select * from trees where id = $1
      `,
      values: [this.treeId],
    };
  }
}

module.exports = SQLTree;
