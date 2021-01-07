import { mount } from "cypress-react-unit-test";
import React from "react";
import BottomPanel from "./BottomPanel";

//describe("Share", () => {
//
//  before(() => {
//  });
//
//  it("Share", () => {
//    mount(
//      <Share 
//        shareUrl="https://treetracker.org/?treeid=300556"
//      />
//    );
//    cy.get(".MuiButtonBase-root")
//      .click();
//    cy.get("#EmbedButton")
//      .click();
//    cy.contains(/copy/i)
//      .click();
//  });
//});

describe("BottomPanel", () => {

  before(() => {
    cy.server();
    cy.route({
      url: "*", 
      response: {
        name: "Anna Eye",
        tokens: {
          total: 10000,
          monthly: [{
            mon: "2020-01-01 00:00:00",
            count: 0,
          },{
            mon: "2020-08-01 00:00:00",
            count: 80,
          },{
            mon: "2020-10-01 00:00:00",
            count: 100,
          },{
            mon: "2020-12-01 00:00:00",
            count: 200,
          }],
        },
        planters: {
          total: 301,
          monthly: [{
            mon: "2018-01-01 00:00:00",
            count: 2,
          },{
            mon: "2019-08-01 00:00:00",
            count: 20,
          },{
            mon: "2020-10-01 00:00:00",
            count: 300,
          },{
            mon: "2020-12-01 00:00:00",
            count: 301,
          }],
        },
        species: {
          total: 10,
          monthly: [{
            mon: "2016-01-01 00:00:00",
            count: 2,
          },{
            mon: "2017-08-01 00:00:00",
            count: 5,
          },{
            mon: "2020-10-01 00:00:00",
            count: 10,
          }],
        },
      },
      delay: 500,
    });
  });

  it("", () => {
    mount(
      <div style={{marginTop: "100px", }} >
      <BottomPanel walletName={"annaeye"} />
      </div>
    );
  });
});
