const {
  getByLabelText,
  getByText,
  getByRole,
  getByTestId,
  getByAltText,
  findByText,
  queryByText,
  prettyDOM,
} = require("@testing-library/dom");
require("@testing-library/jest-dom");
const entity = require("./entity");
const logo = require("./logo.js");

jest.mock("./entity");



describe("Logo", () => {
  let container;
  let logoOriginal = "/img/logo_floating_map.svg";
  let logoCustomer = "http://zaven.com/logo.svg";

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });


  it("Logo.load('http://localhost:3000')", async () => {
    await logo.load("http://localhost:3000", container);
    const image = getByAltText(container, "logo");
    expect(image).toBeDefined();
    console.log("document:", prettyDOM(document));
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", logoOriginal);
  });

  it("logo.load('http://localhost:3000/?wallet=Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    await logo.load("http://localhost:3000/?wallet=Zaven", container);
    expect(entity.getByWallet).toHaveBeenCalled();
    const image = getByAltText(container, "logo");
    expect(image).toBeDefined();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", logoCustomer);
  });

  it("logo.load('http://localhost:3000/@Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    await logo.load("http://localhost:3000/@Zaven", container);
    expect(entity.getByWallet).toHaveBeenCalled();
    const image = getByAltText(container, "logo");
    expect(image).toBeDefined();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", logoCustomer);
  });

});
