const request = require("supertest");
const express = require("express");
const { Pool, Client } = require("pg");

jest.mock("pg");
const query = jest.fn();
Pool.mockImplementation(
  jest.fn(() => ({
    query,
  }))
);

const nearest = require("./nearest");

const nearestResult = [{"st_asgeojson":"{\"type\":\"Point\",\"coordinates\":[39.1089215842116,-5.12839483715479]}"}];

describe("nearest", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/nearest", nearest);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("/nearest?zoom_level=16&lng=85.5&lat=23.4", async () => {
    query.mockResolvedValue({ rows: nearestResult });
    const response = await request(app).get(
      "/nearest?zoom_level=16&lng=85.5&lat=23.4"
    );
    expect(new Pool().query).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(query).toHaveBeenCalledWith({
      text: expect.stringMatching(/select.*trees.*active.*=.*true.*/is),
      values: expect.anything(),
    });
    expect(response.body).toMatchObject({
      nearest: expect.anything(),
    });
  });

  it("/nearest?zoom_level=14&lng=85.5&lat=23.4", async () => {
    query.mockResolvedValue({ rows: nearestResult });
    const response = await request(app).get(
      "/nearest?zoom_level=14&lng=85.5&lat=23.4"
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

  it("/nearest?zoom_level=8&lng=85.5&lat=23.4", async () => {
    query.mockResolvedValue({ rows: nearestResult });
    const response = await request(app).get(
      "/nearest?zoom_level=8&lng=85.5&lat=23.4"
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
