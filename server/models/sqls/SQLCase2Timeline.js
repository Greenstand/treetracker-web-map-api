const SQLCase2 = require("./SQLCase2");

class SQLCase2Timeline extends SQLCase2{
  

  addTimeline(timeline){
    this.timeline = timeline;
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

  getJoin(){
    let result = "";
    return result;
  }

  getQuery(){
    let sql = `
      /* sql case2 */
      SELECT /* DISTINCT ON(trees.id) */
      'point' AS type,
       trees.id, trees.lat, trees.lon 
      FROM trees 
      ${this.getJoin()}
      WHERE active = true 
      ${this.getBoundingBoxQuery()}
      ${this.getFilter()}
    ` 
    ;
    console.log(sql);

    const query = {
      text: sql,
      values: [],
    };
    return query;
  }
}


module.exports = SQLCase2Timeline;
