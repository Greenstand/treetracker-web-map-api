
const pg = require('pg');
const { Pool, Client } = require('pg');
const config = require('./../config/config');
const pool = new Pool({
  connectionString: config.connectionString
});


(async () => {

  const start = Date.now();

  const client = await pool.connect();
  const insert = {
    text: `INSERT INTO tree_region
      (tree_id, zoom_level, region_id)
      SELECT DISTINCT ON (trees.id, zoom_level) trees.id AS tree_id, zoom_level, region.id
      FROM trees
      JOIN region
      ON ST_Contains( region.geom, trees.estimated_geometric_location)
      JOIN region_zoom
      ON region_zoom.region_id = region.id
      WHERE trees.active = true
      AND trees.cluster_regions_assigned = false
      ORDER BY trees.id, zoom_level, region_zoom.priority DESC`
  };
  console.log(insert);
  await client.query(insert);
  await client.query('COMMIT');

  const update = {
    text: `UPDATE trees
      SET cluster_regions_assigned = true
      FROM tree_region
      WHERE tree_region.tree_id = trees.id
      AND cluster_regions_assigned = false`
  };
  console.log(update);
  await client.query(update);

  const refresh = {
    text: `REFRESH MATERIALIZED VIEW active_tree_region`
  }
  await client.query(refresh);

  await client.query('COMMIT');

  client.release();
  pool.end();

  const end = Date.now();
  console.log(start);
  console.log(end);
  console.log('DONE');

})().catch(e => console.error(e.stack))
