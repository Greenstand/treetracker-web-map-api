const request = require("supertest");
const express = require("express");
const {Pool, Client} = require("pg");
const config = require('../config/config');

jest.mock("pg");
const query = jest.fn();
Pool.mockImplementation(jest.fn(() => ({
  query,
})));

const entity = require("./entity");

describe("entity", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/entities", entity);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("/entities/1", async () => {
    query.mockResolvedValue({rows:[{id:1, name: "zaven"}]});
    const response = await request(app)
      .get("/entities/1")
    expect(new Pool().query).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: "select * from entity where id = $1",
      values: ["1"],
    });
    expect(response.body).toMatchObject({
      id: 1,
      name: "zaven",
    });
  });

  it("/entities", async () => {
    query.mockResolvedValue({rows:[{id:1, name: "zaven"}]});
    const response = await request(app)
      .get("/entities")
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: "select * from entity",
      values: [],
    });
    expect(response.body).toMatchObject([{
      id: 1,
      name: "zaven",
    }]);
  });

  it("/entities?wallet=zaven", async () => {
    query.mockResolvedValue({rows:[{id:1, name: "zaven"}]});
    const response = await request(app)
      .get("/entities?wallet=zaven")
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: "select * from entity where wallet = $1",
      values: ["zaven"],
    });
    expect(response.body).toMatchObject([{
      id: 1,
      name: "zaven",
    }]);
  });
});
