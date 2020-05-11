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
    query.mockResolvedValue({id:1, name: "zaven"});
    app = express();
    app.use("/entity", entity);
    jest.clearAllMocks();
  });

  it("", async () => {
    const response = await request(app)
      .get("/entity/1")
    expect(new Pool().query).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: "select * from entity where id = ?",
      values: ["1"],
    });
    expect(response.body).toMatchObject({
      id: 1,
      name: "zaven",
    });
  });
});
