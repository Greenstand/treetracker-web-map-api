var pg = require('pg');
const { Pool, Client } = require('pg');
var config = require('./../config');
const pool = new Pool({
  connectionString: config.connectionString
});


//var bounds='39,-2,35,-5'; // Extended bounds
var bounds = config.optimizedBounds;

var clusterRadius = {
  4:4,
  5:0.8,
  6:0.75,
  7:0.3,
  8:0.099,
  9:0.095,
  10:0.05,
  11:0.03,
  12:0.02,
  13:0.008,
  14:0.005,
  15:0.004,
  16:0.003,
  17:0,
  18:0,
  19:0
};



(async () => {

  const start = Date.now();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    var zoomLevel;
    for(zoomLevel=6; zoomLevel < 17; zoomLevel = zoomLevel + 1){
      sql = `SELECT 'cluster' AS type, 
        St_centroid(clustered_locations) centroid, 
        St_numgeometries(clustered_locations) count 
      FROM   ( 
        SELECT Unnest(St_clusterwithin(estimated_geometric_location, $1)) clustered_locations
        FROM   trees  
        WHERE  active = true ` + 'AND trees.estimated_geometric_location && ST_MakeEnvelope(' + bounds + ', 4326) ' + ` ) clusters`;

      query = {
        text: sql,
        values: [clusterRadius[zoomLevel]]
      };
      console.log(query);

      const {rows} = await client.query(query);
      await client.query('DELETE FROM clusters WHERE zoom_level = ' + zoomLevel);
      console.log(rows);
      for (let row in rows) {
        query = {
          text: 'INSERT INTO clusters (count, zoom_level, location) values ($1, $2, $3 ) RETURNING *',
          values: [rows[row]['count'], zoomLevel, rows[row]['centroid']] 
        };
        await client.query(query);
      }
    }
    await client.query('COMMIT');
    console.log('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('ROLLBACK');
    throw e
  } finally {
    client.release();
    const end = Date.now();
    console.log(start);
    console.log(end);
    console.log('DONE');
  }


})().catch(e => console.error(e.stack))


//pool.query(query)
//  .then(function (data) {
//    console.log(data);
//  })
//  .catch(e => console.error(e.stack));

