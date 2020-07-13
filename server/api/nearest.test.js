const request = require("supertest");
const express = require("express");
const { Pool, Client } = require("pg");
const config = require("../config/config");

jest.mock("pg");
const query = jest.fn();
Pool.mockImplementation(
  jest.fn(() => ({
    query,
  }))
);

const nearest = require("./nearest");

describe("nearest", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/nearest", nearest);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("/nearest?zoom_level=16&longitude=85.5&latitude=23.4", async () => {
    query.mockResolvedValue({ rows: [{ id: 1, name: "zaven" }] });
    const response = await request(app).get(
      "/nearest?zoom_level=16&longitude=85.5&latitude=23.4"
    );
    expect(new Pool().query).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: expect.stringMatching(/select.*active_tree_region.*/is),
      values: expect.anything(),
    });
    expect(response.body).toMatchObject({
      nearest: expect.anything(),
    });
  });

  it("/nearest?zoom_level=14&longitude=85.5&latitude=23.4", async () => {
    query.mockResolvedValue({ rows: [{ id: 1, name: "zaven" }] });
    const response = await request(app).get(
      "/nearest?zoom_level=14&longitude=85.5&latitude=23.4"
    );
    expect(new Pool().query).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: expect.stringMatching(/select.*clusters.*/is),
      values: expect.anything(),
    });
    expect(response.body).toMatchObject({
      nearest: expect.anything(),
    });
  });

  it("/nearest?zoom_level=8&longitude=85.5&latitude=23.4", async () => {
    query.mockResolvedValue({ rows: [{ id: 1, name: "zaven" }] });
    const response = await request(app).get(
      "/nearest?zoom_level=8&longitude=85.5&latitude=23.4"
    );
    expect(new Pool().query).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: expect.stringMatching(/select.*trees.*/is),
      values: expect.anything(),
    });
    expect(response.body).toMatchObject({
      nearest: expect.anything(),
    });
  });

  //  it("/entities", async () => {
  //    query.mockResolvedValue({ rows: [{ id: 1, name: "zaven" }] });
  //    const response = await request(app).get("/entities");
  //    expect(response.statusCode).toBe(200);
  //    expect(query).toHaveBeenCalledWith({
  //      text: "select * from entity",
  //      values: [],
  //    });
  //    expect(response.body).toMatchObject([
  //      {
  //        id: 1,
  //        name: "zaven",
  //      },
  //    ]);
  //  });
  //
  //  it("/entities?wallet=zaven", async () => {
  //    query.mockResolvedValue({ rows: [{ id: 1, name: "zaven" }] });
  //    const response = await request(app).get("/entities?wallet=zaven");
  //    expect(response.statusCode).toBe(200);
  //    expect(query).toHaveBeenCalledWith({
  //      text: "select * from entity where wallet = $1",
  //      values: ["zaven"],
  //    });
  //    expect(response.body).toMatchObject([
  //      {
  //        id: 1,
  //        name: "zaven",
  //      },
  //    ]);
  //  });
});
