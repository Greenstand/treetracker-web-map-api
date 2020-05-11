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
    text: "select * from entity where id = ?",
    values: [req.params.id],
  }
  const result = await pool.query(query);
  res.status(200).send(result);
});

module.exports = router;
