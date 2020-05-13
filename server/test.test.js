const pg = require('pg');
const { Pool, Client } = require('pg');
const config = require('./config/config');
const pool = new Pool({ connectionString: config.connectionString });

describe("", () => {

  it("", async () => {
    console.log("OK");
    console.log("the pool:", pool);
    const query = {
      text: "select * from entity where wallet = $1",
      values: ["Oleksandr2"],
    }
    const data = await pool.query(query)
    console.log("query result:", data);
  });
});
