const SQLCase1 = require("./SQLCase1");

class SQLCase1Timeline extends SQLCase1{

  constructor(){
    super();
    this.timeline = undefined;
  }

  static checkTimeline(timeline){
    if(!timeline.match(/\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}/)){
      throw Error("Wrong timeline:" + timeline);
    }
  }

  addTimeline(timeline){
    SQLCase1Timeline.checkTimeline(timeline);
    this.timeline = timeline;
  }

  getJoin(){
    let result = "";
    //disable parent getJoin, so, just do my job
//    result += super.getJoin();
    if(this.timeline){
      result += "JOIN trees ON tree_region.tree_id = trees.id";
    }
    return result;
  }

  getFilter(){
    let result = "";
    if(this.timeline){
      const [_, begin,end] = this.timeline.match(/(.*)_(.*)/);
      result += `
        AND trees.time_created > '${begin}' AND trees.time_created < '${end}'
      `;
    }
    return result;
  }
}

module.exports = SQLCase1Timeline;
