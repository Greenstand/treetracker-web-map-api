const request = require("supertest");
const app = require("../app");


describe("Integration tests", () => {

  it("with map_name", async () => {
    const res = await request(app)
      .get("/trees?clusterRadius=8&zoom_level=2&map_name=freetown");
    expect(res.statusCode).toBe(200);

  });
});
