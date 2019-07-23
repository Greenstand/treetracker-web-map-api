var pg = require('pg');
const { Pool, Client } = require('pg');
var config = require('./../config/config');
const pool = new Pool({
  connectionString: config.connectionString
});


(async () => {

  const start = Date.now();
  const client = await pool.connect();

  try {

    await client.query('BEGIN');
    const refresh = {
      text: `REFRESH MATERIALIZED VIEW active_tree_region`
    }
    await client.query(refresh);

    await client.query('COMMIT');


    await client.query('BEGIN');

    sql = `SELECT 'cluster' AS type,
      St_centroid(clustered_locations) centroid,
      St_numgeometries(clustered_locations) count
      FROM
      (
        SELECT Unnest(St_clusterwithin(estimated_geometric_location, 0.005)) clustered_locations
        FROM   trees
        WHERE  active = true
      ) clusters`;
    query = {
      text: sql,
    };
    console.log(query);

    const {rows} = await client.query(query);
    zoomLevel = 14;
    await client.query('DELETE FROM clusters WHERE zoom_level = ' + zoomLevel);
    for (let row in rows) {
      query = {
        text: 'INSERT INTO clusters (count, zoom_level, location) values ($1, $2, $3 ) RETURNING *',
        values: [rows[row]['count'], zoomLevel, rows[row]['centroid']]
      };
      await client.query(query);
    }
    await client.query('COMMIT');
    console.log('COMMIT zoom level ' + zoomLevel);

    client.release();
    pool.end();

  } catch (e) {
    await client.query('ROLLBACK');
    console.log('ROLLBACK');
    client.release();
    pool.end();
    throw e
  } finally {
    const end = Date.now();
    console.log(start);
    console.log(end);
    console.log('DONE');
  }


})().catch(e => console.error(e.stack))
