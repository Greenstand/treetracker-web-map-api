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
  //tokens
  {
    const query = {
      text: `
        SELECT mon, sum(token_count) OVER (ORDER BY mon) AS "count" FROM 
        (
          SELECT date_trunc('mon', created_at) AS mon, count(id) AS token_count  FROM wallets.token 
          WHERE entity_id = $1
          GROUP BY mon
        ) tt
        ORDER BY mon`,
      values: [wallet.id],
    }
    const result = await pool.query(query);
    const monthly = result.rows;
    expect(monthly).match([{
      mon: expect.any("string"), 
      count: expect.any("number")
    }]);
    wallet.tokens = {
      total: monthly.reduce((a,c) => c.count > a?c.count:a, 0),
      monthly,
    }
  }
  //planter
  {
    const query = {
      text: `
        SELECT mon, sum("count") OVER (ORDER BY mon) AS "count" FROM 
        (
          SELECT date_trunc('mon', created_at) AS mon, count(planter_id) AS count FROM 
          (
            SELECT DISTINCT tr.planter_id, pr.created_at
            FROM wallets."token" AS t
            JOIN wallets.wallet AS w
            ON t.entity_id = w.id
            JOIN trees AS tr
            ON tr.id = t.tree_id
            JOIN planter AS p 
            ON tr.planter_id = p.id
            LEFT JOIN planter_registrations AS pr
            ON p.id = pr.planter_id
            WHERE w.id = $1
          ) pl
          GROUP BY mon
        ) tt
        ORDER BY mon
      `,
      values: [wallet.id],
    }
    const result = await pool.query(query);
    const monthly = result.rows;
    expect(monthly).match([{
      mon: expect.any("string"), 
      count: expect.any("number")
    }]);
    wallet.planters = {
      total: monthly.reduce((a,c) => c.count > a?c.count:a, 0),
      monthly,
    }
  }
  //species
  {
    const query = {
      text: `
        SELECT tr.id tree_id, date_trunc('mon', time_created) AS mon, species_id FROM trees tr
        JOIN wallets."token" t 
        ON t.tree_id = tr.id
        WHERE t.entity_id = $1
        AND tr.species_id IS NOT NULL 
        ORDER BY mon
      `,
      values: [wallet.id],
    }
    const result = await pool.query(query);
    const monthly = result.rows;
    expect(monthly).match([{
      tree_id: expect.any("number"),
      mon: expect.any("string"), 
      species_id: expect.any("number")
    }]);
    //convert to {mon: xxx, count: n}
    const species = new Set();
    const monthlyMap = {};
    monthly.forEach(e => {
      species.add(e.species_id);
      monthlyMap[e.mon] = species.size;
    });
    const r = Object.keys(monthlyMap).map(mon => {
      return {
        mon,
        count: monthlyMap[mon],
      }
    });
    wallet.species = {
      total: r.reduce((a,c) => c.count > a?c.count:a, 0),
      monthly: r,
    }
  }

  res.status(200).send(wallet);
});


module.exports = router;
