const MapModel = require("./MapModel");
const axios = require("axios");

jest.mock("axios");

describe("MapModel", () => {

  beforeEach(async () => {
  });

  afterAll(() => {
    jest.clearAllMock();
  });

  it("checkArrow", async () => {
    //mock jQuery
    global.$ = () => ({
      addClass: jest.fn(),
      removeClass: jest.fn(),
      css: jest.fn(),
      show: jest.fn(),
    });
    //mock google map
    global.google = {
      maps: {
        geometry: {
          spherical: {
            computeDistanceBetween: jest.fn()
              .mockReturnValueOnce(800)
              .mockReturnValueOnce(0),
          },
        },
        LatLng: jest.fn(),
      },
    };
    axios.get = jest.fn(() => ({
      status: 200,
      data: {
        nearest: {
          type: "cluster",
          coordinate: {
            lat: 20,
            lng: 0,
          }
        },
      },
    }));
    const mapModel = new MapModel();
    jest.spyOn(mapModel, "showArrow");
    expect(mapModel).toBeInstanceOf(MapModel);
    mapModel.markers = [];
    mapModel.map = {
      getCenter: () => ({
        lat: () => 0,
        lng: () => 0,
        toJSON: () => ({lat:0,lng:0}),
      }),
      getBounds: () => ({
        contains: () => false,
      }),
    };
    await mapModel.checkArrow();
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/web\/nearest.*/)
    );
    expect(mapModel.showArrow).toHaveBeenCalledWith("north");
  });


//  it("module defined", async () => {
//    console.log("entity:", entity);
//    expect(entity).toMatchObject({
//      name: "entity",
//    });
//    expect(entity.getById).toBeDefined();
//    expect(entity.getByWallet).toBeDefined();
//  });
//
//  it("getById(1)", async () => {
//    axios.get = jest.fn(() => ({
//      status: 200,
//      data: {
//        id: 1,
//        name: "Zaven",
//        logoUrl: "http://logo",
//      },
//    }));
//    const e = await entity.getById(1);
//    expect(axios.get).toHaveBeenCalledWith("/api/web/entities/1");
//    expect(e).toMatchObject({
//      id: 1,
//      name: "Zaven",
//      logoUrl: "http://logo",
//    });
//  });
//
//  it("getByWallet('Zaven')", async () => {
//    axios.get = jest.fn(() => ({
//      status: 200,
//      data: [{
//        id: 1,
//        name: "Zaven",
//        logoUrl: "http://logo",
//      }],
//    }));
//    const e = await entity.getByWallet("Zaven");
//    expect(axios.get).toHaveBeenCalledWith("/api/web/entities?wallet=Zaven");
//    expect(e).toMatchObject([{
//      id: 1,
//      name: "Zaven",
//      logoUrl: "http://logo",
//    }]);
//  });
});
