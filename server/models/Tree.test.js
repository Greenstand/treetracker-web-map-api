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
    query
      .mockResolvedValueOnce({
        rows: [{
          id: 1,
          domain_specific_data: {},
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
            key: "key1",
            value: "value1",
          },{
            key: "key2",
            value: "value2",
          }],
      });
    const tree = new Tree();
    const treeDetail = await tree.getTreeById(1);
    expect(treeDetail.id).toBe(1);
    expect(treeDetail.domain_specific_data).toMatchObject({});
    expect(treeDetail.attributes).toMatchObject({
      key1: "value1",
      key2: "value2",
    });
  });

});
