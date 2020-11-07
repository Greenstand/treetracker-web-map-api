const request = require("supertest");
jest.mock("pg");
const {Pool} = require("pg");
//because in app, we new the Pool directly(not in function), so we need to mock this
//before we import 'app'
const query = jest.fn().mockReturnValue(true);
Pool.prototype.query = query;
const test = new Pool();
const r = test.query();
expect(r).toBe(true);

const app = require("./app");

describe("App", () => {

  beforeAll(() => {
  })

  it("with userid, and trees count under this user < 2000", async () => {
    const queryCount = jest.fn()
      .mockResolvedValue({
        rows: [{count:1999}],
      });
    const queryOthers = jest.fn()
      .mockResolvedValue({
        rows: [1,2],
      });
    query.mockImplementationOnce(queryCount)
      .mockImplementation(queryOthers);
    const res = await request(app)
      .get("/trees?userid=1");
    expect(res.statusCode).toBe(200);
    expect(queryCount).toBeCalledWith({
      text: expect.stringMatching(/count/i),
      values: []
    });
    expect(queryOthers).toBeCalledWith({
      text: expect.stringMatching(/Unnest/i),
      values: expect.anything(),
    });
  });

  it("with userid, and trees count under this user > 2000", async () => {
    const queryCount = jest.fn()
      .mockResolvedValue({
        rows: [{count:2001}],
      });
    const queryOthers = jest.fn()
      .mockResolvedValue({
        rows: [1,2],
      });
    query.mockImplementationOnce(queryCount)
      .mockImplementation(queryOthers);
    const res = await request(app)
      .get("/trees?clusterRadius=0.05&zoom_level=10&userid=12");
    expect(res.statusCode).toBe(200);
    expect(queryCount).toBeCalledWith({
      text: expect.stringMatching(/count/i),
      values: []
    });
    expect(queryOthers).toBeCalledWith({
      //should call the new query with `join` to the tree, 
      text: expect.stringMatching(/join trees on.*tree_region.tree_id = trees.id/is),
      values: expect.anything(),
    });
  });

  it("/trees?clusterRadius=8&zoom_level=2", async () => {
    const queryA = jest.fn()
      .mockResolvedValue({
        rows: [1,2],
      });
    query.mockImplementation(queryA);
    const res = await request(app)
      .get("/trees?clusterRadius=8&zoom_level=2");
    expect(res.statusCode).toBe(200);
    expect(queryA).toBeCalledWith({
      //should call the new query with `join` to the tree, 
      text: expect.stringMatching(/case1/is),
      values: expect.anything(),
    });
  });
});
