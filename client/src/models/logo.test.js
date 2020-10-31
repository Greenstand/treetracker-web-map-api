const entity = require("./entity");
const getLogo = require("./logo.js");

jest.mock("./entity");



describe("Logo", () => {
  let logoOriginal = "/img/logo_floating_map.svg";
  let logoCustomer = "http://zaven.com/logo.svg";

  beforeEach(async () => {
  });


  it("getLogo('http://localhost:3000') should return Greenstand logo", async () => {
    const logo = await getLogo("http://localhost:3000");
    //in this case, should return a object, cuz we can use a src string for local image
    expect(typeof logo).toBe("object");
  });

  it("getLogo('http://localhost:3000/?wallet=Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("http://localhost:3000/?wallet=Zaven");
    expect(entity.getByWallet).toHaveBeenCalled();
    expect(logo).toBe(logoCustomer);
  });

  it("getLogo('http://localhost:3000/@Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("http://localhost:3000/@Zaven");
    expect(entity.getByWallet).toHaveBeenCalled();
    expect(logo).toBe( logoCustomer);
  });

  it("getLogo('https://localhost:3000/@Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("https://localhost:3000/@Zaven");
    expect(entity.getByWallet).toHaveBeenCalled();
    expect(logo).toBe( logoCustomer);
  });

});
