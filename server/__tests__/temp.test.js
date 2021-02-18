const request = require("supertest");
const app = require("../app");

describe("/trees", () => {
  const url = "/trees?clusterRadius=8&zoom_level=2&timeline=2015-01-01_2015-12-31";
  it(url, async () => {
    const res = await request(app)
      .get(url);
    expect(res.statusCode).toBe(200);
  });
});

