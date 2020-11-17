const request = require("supertest");
jest.mock("./models/Map");
const app = require("./app");
const Map = require("./models/Map");

describe("App", () => {

  beforeAll(() => {
  })

  it("app", async () => {
    const res = await request(app)
      .get("/trees?clusterRadius=8&zoom_level=2");
    expect(res.statusCode).toBe(200);
    expect(Map).toHaveBeenCalledTimes(1);
    const mapInstance = Map.mock.instances[0];
    expect(mapInstance.init).toHaveBeenCalledWith({
      clusterRadius: "8",
      zoom_level: "2",
    });
  });



});
