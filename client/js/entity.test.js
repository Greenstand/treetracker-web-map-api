const entity = require("./entity");
const axios = require("axios");

jest.mock("axios");

describe("entity", () => {

  beforeEach(async () => {
    axios.get = jest.fn(() => ({
      status: 200,
      data: {
        id: 1,
        name: "Zaven",
        logoUrl: "http://logo",
      },
    }));
  });

  it("module defined", async () => {
    console.log("entity:", entity);
    expect(entity).toMatchObject({
      name: "entity",
    });
    expect(entity.load).toBeDefined();
  });

  it("load", async () => {
    const e = await entity.load(1);
    expect(axios.get).toHaveBeenCalledWith("/entitys/1");
    expect(e).toMatchObject({
      id: 1,
      name: "Zaven",
      logoUrl: "http://logo",
    });
  });
});
