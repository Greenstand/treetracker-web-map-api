import myExpect from "./expect";

describe("expect", () => {

  it("defined", () => {
    let a;
    expect(() => {
      myExpect(a).defined();
    }).toThrow();

    a = 1;
    expect(() => {
      myExpect(a).defined();
    }).not.toThrow();
  });

  it("not.defined", () => {
    let a = 1;
    expect(() => {
      myExpect(a).not.defined();
    }).toThrow();
  });

});

