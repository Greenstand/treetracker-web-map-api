/*
 * The entity business, (entity table)
 */
const express = require("express");
const router = express.Router();
const { Pool, Client } = require("pg");
const chai = require("chai");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

//router.get("/:id", async function (req, res, next) {
//  console.log("id:", req.params.id);
//  const query = {
//    text: "select * from entity where id = $1",
//    values: [req.params.id],
//  };
//  const result = await pool.query(query);
//  res
//    .status(200)
//    .send(
//      (result && result.rows && result.rows.length > 0 && result.rows[0]) ||
//        null
//    );
//});

router.get("/", async function (req, res, next) {
  try{
    let { zoom_level, lng, lat } = req.query;
    zoom_level = parseInt(zoom_level);
    lng = parseFloat(lng);
    lat = parseFloat(lat);
    console.log("lng:", lng);
    chai.expect(zoom_level).above(0);
    chai.expect(lng).not.NaN;
    chai.expect(lat).not.NaN;
    let query;
    if (zoom_level <= 11) {
      query = {
        text: `
    SELECT
      ST_ASGeoJson(centroid)
    FROM
      active_tree_region
    WHERE 
      zoom_level = ${zoom_level}
    ORDER BY
      active_tree_region.centroid <->
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}),4326)
    LIMIT 1;
    `,
        values: [],
      };
    } else if (zoom_level < 15 && zoom_level > 11) {
      query = {
        text: `
  SELECT
    ST_ASGeoJson(location)
  FROM
    clusters
  ORDER BY
    location <->
    ST_SetSRID(ST_MakePoint(${lng}, ${lat}),4326)
  LIMIT 1;
    `,
        values: [],
      };
    } else if (zoom_level >= 15) {
      query = {
        text: `
  SELECT
    ST_ASGeoJson(estimated_geometric_location)
  FROM
    trees
  WHERE
    active = true
  ORDER BY
    estimated_geometric_location <->
    ST_SetSRID(ST_MakePoint(${lng}, ${lat}),4326)
  LIMIT 1;
    `,
        values: [],
      };
    }
    console.log("query:", query);
    const result = await pool.query(query);
    //{"st_asgeojson":"{\"type\":\"Point\",\"coordinates\":[39.1089215842116,-5.12839483715479]}"}
    res.status(200).json({
      nearest: result.rows.length > 0 ?
        JSON.parse(result.rows[0].st_asgeojson)
      :
        null
    });
  }catch(e){
    console.error(e);
    res.status(500).end();
  }
});

module.exports = router;
