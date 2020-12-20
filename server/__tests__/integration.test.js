const request = require("supertest");
const app = require("../app");

describe("Integration tests", () => {

  describe("/trees", () => {
    it("/trees?clusterRadius=8&zoom_level=2&map_name=freetown", async () => {
      const res = await request(app)
        .get("/trees?clusterRadius=8&zoom_level=2&map_name=freetown");
      expect(res.statusCode).toBe(200);
    }, 100000);

    it("/trees?clusterRadius=0.02&zoom_level=12&bounds=0.27413497359721345,0.09675638212298909,-0.3191267451527627,-0.07998612103164923&map_name=freetown", async () => {
      const res = await request(app)
        .get("/trees?clusterRadius=0.02&zoom_level=12&bounds=0.27413497359721345,0.09675638212298909,-0.3191267451527627,-0.07998612103164923&map_name=freetown");
      expect(res.statusCode).toBe(200);
    }, 100000);

    it.skip("/trees?clusterRadius=0.003&zoom_level=16&bounds=0.018839836120605472,0.005394458765216459,-0.018239021301269535,-0.0056519508298092415&map_name=freetown", async () => {
      const res = await request(app)
        .get("/trees?clusterRadius=0.003&zoom_level=16&bounds=0.018839836120605472,0.005394458765216459,-0.018239021301269535,-0.0056519508298092415&map_name=freetown");
      expect(res.statusCode).toBe(200);
    }, 90000);

    it("/trees?clusterRadius=0.05&zoom_level=10&userid=12", async () => {
      const res = await request(app)
        .get("/trees?clusterRadius=0.05&zoom_level=10&userid=12");
      expect(res.statusCode).toBe(200);
    }, 100000);
  });

  describe("/tree", () => {
    it("/tree?tree_id=198081", async () => {
      const res = await request(app)
        .get("/tree?tree_id=198081");
      expect(res.statusCode).toBe(200);
      console.log("tree detail:", res.body);
      expect(res.body).toMatchObject({
        id: 198081,
        domain_specific_data: {},
        attributes: {
          delta_step_count: "1",
        },
        images: {},
        token_uuid: expect.any(String),
        wallet: expect.any(String),
      });
    }, 100000);
  });

  it("/trees?clusterRadius=0.05&zoom_level=10&userid=12", async () => {
    const res = await request(app)
      .get("/trees?clusterRadius=0.05&zoom_level=10&userid=12");
    expect(res.statusCode).toBe(200);
  }, 100000);


  describe("wallet map", () => {
    it("/trees?clusterRadius=0.02&zoom_level=12&wallet=forestmatic_demo", async () => {
      const res = await request(app)
        .get("/trees?clusterRadius=0.02&zoom_level=12&wallet=forestmatic_demo");
      expect(res.statusCode).toBe(200);
    }, 100000);

    it("/trees?clusterRadius=0.02&zoom_level=16&wallet=forestmatic_demo", async () => {
      const res = await request(app)
        .get("/trees?clusterRadius=0.02&zoom_level=16&wallet=forestmatic_demo");
      expect(res.statusCode).toBe(200);
    }, 100000);
  });

});
