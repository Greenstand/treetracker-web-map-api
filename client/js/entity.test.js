const entity = require("./entity");
const axios = require("axios");

jest.mock("axios");

describe("entity", () => {

  beforeEach(async () => {
  });

  afterAll(() => {
    jest.clearAllMock();
  });

  it("module defined", async () => {
    console.log("entity:", entity);
    expect(entity).toMatchObject({
      name: "entity",
    });
    expect(entity.getById).toBeDefined();
    expect(entity.getByWallet).toBeDefined();
  });

  it("getById(1)", async () => {
    axios.get = jest.fn(() => ({
      status: 200,
      data: {
        id: 1,
        name: "Zaven",
        logoUrl: "http://logo",
      },
    }));
    const e = await entity.getById(1);
    expect(axios.get).toHaveBeenCalledWith("/api/web/entities/1");
    expect(e).toMatchObject({
      id: 1,
      name: "Zaven",
      logoUrl: "http://logo",
    });
  });

  it("getByWallet('Zaven')", async () => {
    axios.get = jest.fn(() => ({
      status: 200,
      data: [{
        id: 1,
        name: "Zaven",
        logoUrl: "http://logo",
      }],
    }));
    const e = await entity.getByWallet("Zaven");
    expect(axios.get).toHaveBeenCalledWith("/api/web/entities?wallet=Zaven");
    expect(e).toMatchObject([{
      id: 1,
      name: "Zaven",
      logoUrl: "http://logo",
    }]);
  });
});
