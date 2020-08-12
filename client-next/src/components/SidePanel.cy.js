import { mount } from "cypress-react-unit-test";
import React from "react";
import SidePanel from "./SidePanel";

describe("SidePanel", () => {

  it("SidePanel", () => {
    const tree = {
      first_name: "Dadior",
      last_name: "Chen",
    };
    mount(
      <SidePanel tree={tree} />
    );
    cy.contains("Dadior");
  });

});

