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
          mon: "2020-12-15 22:00:00", 
          token_count: 1,
        }],
      })
    const res = await request(app).get("/annaeye");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      name: "Anna Eye",
      tokens: {
        total: 1,
        tokenMonthly: [{
          mon: expect.any(String),
          token_count: expect.any(Number),
        }],
      },
    });
  });

});
