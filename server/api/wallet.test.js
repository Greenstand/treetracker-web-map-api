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

const wallet = require("./wallet");

const nearestResult = [{"st_asgeojson":"{\"type\":\"Point\",\"coordinates\":[39.1089215842116,-5.12839483715479]}"}];

describe("nearest", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/", wallet);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("/:wallet", async () => {
    query.mockReset();
    query
      .mockResolvedValueOnce({
        rows: [{
          name: "Anna Eye",
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          mon: "2019-12-31T16:00:00.000Z",
          count: "1",
        },{
          mon: "2020-12-01 22:00:00", 
          count: "4",
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          mon: "2020-11-01 00:00:00", 
          planter_id: 1,
        },{
          mon: "2020-12-01 00:00:00", 
          planter_id: 2,
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          tree_id: 1,
          mon: "2020-11-01 00:00:00", 
          species_id: 1,
        },{
          tree_id: 2,
          mon: "2020-11-01 00:00:00", 
          species_id: 1,
        },{
          tree_id: 3,
          mon: "2020-12-01 00:00:00", 
          species_id: 2,
        }],
      })
    const res = await request(app).get("/annaeye");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      name: "Anna Eye",
      tokens: {
        total: 4,
        monthly: [{
          mon: expect.anything(),
          count: 1,
        },{
          mon: expect.anything(),
          count: 4,
        }],
      },
      planters: {
        total: 2,
        monthly: expect.anything(),
      },
      species: {
        total: 2,
        monthly: [{
          mon: expect.anything(),
          count: 1,
        },{
          mon: expect.anything(),
          count: 2,
        }],
      },
    });
  });

});
