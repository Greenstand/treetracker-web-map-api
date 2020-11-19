const SQLTree = require("./SQLTree");

describe("SQLTree", () => {

  it("", async () => {
    const sql = new SQLTree();
    sql.setTreeId(1);
    const query = await sql.getQuery();
    expect(query).toMatchObject({
      text: expect.stringMatching(/select.*trees.*inner join planter.*left join tree_species.*id =/is),
      values: [1],
    });
  });
});
