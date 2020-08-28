/* 
 * The entity business, (entity table)
 */
const express = require("express");
const router = express.Router();
const {Pool, Client} = require("pg");
var config = require('../config/config');

const pool = new Pool({ connectionString: config.connectionString });

router.get("/:id", async function(req, res, next){
  console.log("id:", req.params.id);
  const query = {
    text: "select * from entity where id = $1",
    values: [req.params.id],
  }
  const result = await pool.query(query);
  res.status(200).send((result && result.rows && result.rows.length > 0 && result.rows[0]) || null);
});

router.get("/", async function(req, res, next){
  let where = "";
  let values = [];
  if(req.query.wallet){
    where = " where wallet = $1";
    values.push(req.query.wallet);
  }
  const query = {
    text: "select * from entity" + where, 
    values,
  }
  const result = await pool.query(query);
  res.status(200).send(result.rows);
});

module.exports = router;
