/*
 * Case4, search DB via clusters table
 */

class SQLCase4{

  constructor(){
  }

  setBounds(bounds){
    this.bounds = bounds;
  }

  getBoundingBoxQuery(){
    let result = "";
    if (this.bounds) {
      result += 'AND location && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
    }
    return result;
  }

  getQuery(){
      const query = {
        text: `
          /* case4 */
          SELECT 'cluster' as type,
            St_asgeojson(location) centroid, count
          FROM clusters
          WHERE zoom_level = 14 
          ${this.getBoundingBoxQuery()}
        `,
        values: [],
      }
    return query;
  }
}

module.exports = SQLCase4;
