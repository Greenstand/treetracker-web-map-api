import {parseMapName, parseWallet} from "./utils";

describe("parseMapName", () => {

  it("freetown.treetracker.org should return freetown", () => {
    expect(parseMapName("freetown.treetracker.org")).toBe("freetown");
  });
  it("treetracker.org should return undefined", () => {
    expect(parseMapName("treetracker.org")).toBeUndefined();
  });

  it("treetracker.org should return undefined", () => {
    expect(parseMapName("treetracker.org")).toBeUndefined();
  });

  it("test.treetracker.org should return undefined", () => {
    expect(parseMapName("test.treetracker.org")).toBeUndefined();
  });

  it("dev.treetracker.org should return undefined", () => {
    expect(parseMapName("dev.treetracker.org")).toBeUndefined();
  });

  it("localhost should return undefined", () => {
    expect(parseMapName("localhost")).toBeUndefined();
  });


  it("http://dev.treetracker.org should throw error", () => {
    expect(() => {
      parseMapName("http://dev.treetracker.org");
    }).toThrow();
  });

  it("wallet.treetracker.org should return undefined", () => {
    expect(parseMapName("wallet.treetracker.org")).toBeUndefined();
  });

  it("ready.treetracker.org should return undefined", () => {
    expect(parseMapName("ready.treetracker.org")).toBeUndefined();
  });

});

describe("parseWallet", () => {

  it("https://treetracker.org/@AnnaEye", () => {
    expect(parseWallet("https://treetracker.org/@AnnaEye")).toBe("AnnaEye");
  });

  it("http://treetracker.org/@AnnaEye", () => {
    expect(parseWallet("http://treetracker.org/@AnnaEye")).toBe("AnnaEye");
  });

  it("http://treetracker.org/@Conrad.Hills", () => {
    expect(parseWallet("http://treetracker.org/@Conrad.Hills")).toBe("Conrad.Hills");
  });

  it("http://treetracker.org/?wallet=AnnaEye", () => {
    expect(parseWallet("http://treetracker.org/?wallet=AnnaEye")).toBe("AnnaEye");
  });

  it("http://treetracker.org/?wallet=AnnaEye&userid=1", () => {
    expect(parseWallet("http://treetracker.org/?wallet=AnnaEye&userid=1")).toBe("AnnaEye");
  });

  it("http://treetracker.org/?wallet=AnnaEye&userid=1", () => {
    expect(parseWallet("http://treetracker.org/?wallet=AnnaEye&userid=1")).toBe("AnnaEye");
  })

  it("http://treetracker.org/?wallet=AnnaEye&userid=1", () => {
    expect(parseWallet("http://treetracker.org/?wallet=AnnaEye&userid=1")).toBe("AnnaEye");
  });

  it("http://treetracker.org/?wallet=Conrad.Hills&userid=1", () => {
    expect(parseWallet("http://treetracker.org/?wallet=Conrad.Hills&userid=1")).toBe("Conrad.Hills");
  });

  it("http://treetracker.org/?wallet=Conrad-Hills&userid=1", () => {
    expect(parseWallet("http://treetracker.org/?wallet=Conrad-Hills&userid=1")).toBe("Conrad-Hills");
  });

  it("http://treetracker.org/?userid=1", () => {
    expect(parseWallet("http://treetracker.org/?userid=1")).toBeUndefined();
  });

});
