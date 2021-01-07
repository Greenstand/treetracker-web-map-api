const express = require("express");
const expect = require("expect-runtime");
const router = express.Router();
const {Pool, Client} = require("pg");
var config = require('../config/config');

const pool = new Pool({ connectionString: config.connectionString });

router.get("/:walletName", async function(req, res){
  console.log("id:", req.params.id);
  if(!req.params.walletName){
    res.status("403").send("please give the name of wallet");
    return;
  }
  const query = {
    text: "select id, name from wallet where name = $1",
    values: [req.params.walletName],
  }
  const result = await pool.query(query);
  if(result.rows.length === 0){
    res.status(404).send("can not find wallet:" + req.params.walletName);
    return;
  }
  const wallet = result.rows[0];
  //static
  {
    const query = {
      text: "SELECT date_trunc('hour', created_at) AS mon, count(id) AS token_count  FROM token where  entity_id = $1 GROUP BY mon",
      values: [wallet.id],
    }
    const result = await pool.query(query);
    const tokenMonthly = result.rows;
    expect(tokenMonthly).match([{mon: expect.any("string"), token_count: expect.any("number")}]);
    wallet.tokens = {
      total: tokenMonthly.reduce((a,c) => a + c.token_count, 0),
      tokenMonthly,
    }
  }

  res.status(200).send(wallet);
});

//router.get("/", async function(req, res, next){
//  let where = "";
//  let values = [];
//  if(req.query.wallet){
//    where = " where wallet = $1";
//    values.push(req.query.wallet);
//  }
//  if(req.query.map_name){
//    where = " where map_name = $1";
//    values.push(req.query.map_name);
//  }
//  const query = {
//    text: "select * from entity" + where, 
//    values,
//  }
//  const result = await pool.query(query);
//  res.status(200).send(result.rows);
//});

module.exports = router;
