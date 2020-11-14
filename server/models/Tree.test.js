const Tree = require("./Tree");
const {Pool} = require("pg");
jest.mock("pg");

describe("Tree", () => {
  let query;

  beforeEach(() => {
    query = jest.fn().mockReturnValue(true);
    Pool.prototype.query = query;
  })

  it("getTree", async () => {
    query.mockResolvedValue({
      id: 1,
    });
    const tree = new Tree();
    const treeDetail = await tree.getTreeById(1);
    expect(treeDetail.id).toBe(1);
  });

});
