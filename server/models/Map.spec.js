const Map = require("./Map");

const {Pool} = require("pg");
jest.mock("pg");

describe("Map", () => {
  let query;

  beforeAll(() => {
    query = jest.fn().mockReturnValue(true);
    Pool.prototype.query = query;
  })

  it("{clusterRadius=8, zoom_level=2} should call SQL case1 ", async () => {
    const map = new Map();
    await map.init({
      clusterRadius: 8,
      zoom_level: 2,
    });
    const query = await map.getQuery();
    expect(query).toMatchObject({
      text: expect.stringMatching(/case1/i),
      values: expect.anything(),
    });
  });

  it("with userid, and trees count under this user < 2000", async () => {
    const queryCount = jest.fn()
      .mockResolvedValue({
        rows: [{count:1999}],
      });
    query.mockImplementationOnce(queryCount);
    const map =new Map();
    await map.init({userid:1});
    const result = await map.getQuery();
    expect(queryCount).toBeCalledWith({
      text: expect.stringMatching(/count/i),
      values: []
    });
    expect(result).toMatchObject({
      //case 3
      text: expect.stringMatching(/case3/i),
      values: expect.anything(),
    });
  });

  it("with userid, and trees count under this user > 2000", async () => {
    const queryCount = jest.fn()
      .mockResolvedValue({
        rows: [{count:2001}],
      });
    query.mockImplementationOnce(queryCount);
    const map =new Map();
    await map.init({
      clusterRadius: 0.05,
      zoom_level: 10,
      userid: 12
    });
    const result = await map.getQuery();
    expect(queryCount).toBeCalledWith({
      text: expect.stringMatching(/count/i),
      values: []
    });
    expect(result).toMatchObject({
      //should call the new query with `join` to the tree, 
      text: expect.stringMatching(/case5/is),
      values: expect.anything(),
    });
  });
});
