const {parseMapName} = require("./utils");

describe("parseMapName", () => {

  it("freetown.treetracker.org should return freetown", () => {
    expect(parseMapName("freetown.treetracker.org")).toBe("freetown");
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

});
