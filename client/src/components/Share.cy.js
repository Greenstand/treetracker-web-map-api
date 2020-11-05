import { mount } from "cypress-react-unit-test";
import React from "react";
import Share from "./Share";

describe("Share", () => {

  before(() => {
  });

  it("Share", () => {
    mount(
      <Share 
      />
    );
    cy.get(".MuiButtonBase-root")
      .click();
  });
});

