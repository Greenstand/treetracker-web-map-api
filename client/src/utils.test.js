import {parseMapName} from "./utils";

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

});
