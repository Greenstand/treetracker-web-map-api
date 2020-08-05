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

  it("{a:1} defined.property('a').number()", () => {
    let o = {a:1};
    myExpect(o).defined().property("a").number();
  });

  it("{a:[1]} defined.property('a').property(0).number()", () => {
    let o = {a:[1]};
    myExpect(o).defined().property("a").property(0).number();
  });

  it("{a:1, b:'s'} match({a:1,b:'s'))", () => {
    myExpect({a:1, b:'s'}).match({a:1,b:'s'});
  });

  it("{a:1, b:'s'} match({a:'1',b:'s')) should throw", () => {
    expect(() => {
      myExpect({a:1, b:'s'}).match({a:'1',b:'s'});
    }).toThrow();
  });

  it("{a:1, b:'s', c:true} match({a:expect.any(Number),b:expect.any(String),c:expect.anything()))", () => {
    myExpect({a:1, b:'s', c: true}).match({
      a:myExpect.any(Number),
      b:myExpect.any(String),
      c:myExpect.anything(),});
  });

  it("'123' match(/\\d+/)", () => {
    myExpect('123').match(/\d+/);
  });

  it("'abc' match(/^a/)", () => {
    myExpect('abc').match(/^a/);
  });

  it("undefined match {a:1} should throw", () => {
    expect(() => {
      myExpect(undefined).match({a:1});
    }).toThrow();
  });

  it("{a: {b: 1}}", () => {
    myExpect({a: {b:1}}).match({a: {b:1}});
  });

  it("{a: {b: {c: 1}}}", () => {
    myExpect({a: {b: {c:1}}}).match({a: {b: {c:1}}});
  });

  it("{a: [1, 2]}}", () => {
    myExpect({a: [1,2]}).match({a: myExpect.any(Array)});
  });

});

