

describe("Web Map", () => {

  it("Web map", () => {
    cy.visit("http://localhost:3000/")
      .contains("49K");
  });

});

