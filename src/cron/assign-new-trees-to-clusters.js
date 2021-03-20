
const pg = require('pg');
const { Pool, Client } = require('pg');
const config = require('./../config/config');
const pool = new Pool({
  connectionString: config.connectionString
});


(async () => {

  const start = Date.now();

  const client = await pool.connect();

  const select = {
    text: `SELECT count(id)
    FROM trees
    WHERE trees.active = true
    AND trees.cluster_regions_assigned = false`
  };
  const rval = await client.query(select);
/*  if(rval.rows[0].count == 0){
    console.log("no new trees");
    client.release();
    pool.end();
    return;
  }
  */



  var done = false;
  while(!done){

    await client.query('BEGIN');
    const insert = {
      text: `INSERT INTO tree_region
        (tree_id, zoom_level, region_id)
        SELECT DISTINCT ON (trees.id, zoom_level) trees.id AS tree_id, zoom_level, region.id
        FROM (
            SELECT *
            FROM trees
            WHERE trees.active = true
            AND trees.cluster_regions_assigned = false
            LIMIT 1000
        ) trees
        JOIN region
        ON ST_Contains( region.geom, trees.estimated_geometric_location)
        JOIN region_zoom
        ON region_zoom.region_id = region.id
        ORDER BY trees.id, zoom_level, region_zoom.priority DESC
        `
    };
    console.log(insert);
    await client.query(insert);

    const update = {
      text: `UPDATE trees
        SET cluster_regions_assigned = true
        FROM tree_region
        WHERE tree_region.tree_id = trees.id
        AND cluster_regions_assigned = false`
    };
    console.log(update);
    await client.query(update);

    await client.query('COMMIT');

    const select = {
      text: `SELECT count(id)
      FROM trees
      WHERE trees.active = true
      AND trees.cluster_regions_assigned = false`
    };
    const rval = await client.query(select);
    if(rval.rows[0].count == 0){
      done = true;
    }
  }

  await client.query('BEGIN');
  await client.query('COMMIT');

  await client.query('BEGIN');
  const refresh = {
    text: `REFRESH MATERIALIZED VIEW CONCURRENTLY active_tree_region`
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
  console.log('generated clusters at zoom level ' + zoomLevel);

  client.release();
  pool.end();

  const end = Date.now();
  console.log( "Start: " + start);
  console.log( "End: " + end);
  console.log( "Elapsed: " + end - start);
  console.log('DONE');

})().catch( async function(e){
    console.error(e.stack);
    await client.query('ROLLBACK');
    client.release();
    pool.end();
  }
);
