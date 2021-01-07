import { mount } from "cypress-react-unit-test";
import React from "react";
import Chart from "./Chart";
import ChartJs from "chart.js";

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



describe.only("Sandbox", () => {

  it("", () => {

function Test(props){
  const refCanvas = React.useRef();
  const config = {
    type: "line",
    data: {
//      labels: ['Jan', '', 'Mar', '', 'May', '', 'Jul'],
      datasets: [{
        label: props.label,
        data: [{
          x: "2020-08-01 00:00:00",
          y: 100,
        },{
          x: "2020-11-01 00:00:00",
          y: 1000,
        },{
          x: "2020-12-01 00:00:00",
          y: 2000,
        }],
      }],
    },
    options: {
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            stepSize: 3, 
          }
        }],
        xAxes: [{
          type: "time",
          time: {
            unit: "month",
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }]
      }
    },
  }
  //load
  React.useEffect(() => {
    const ctx = refCanvas.current.getContext("2d");
    window.myLine = new ChartJs(ctx, config);
  }, []);

  return (
    <div>
      <canvas ref={refCanvas} width="220px" height="120px" ></canvas>
    </div>
  );
}
    mount(
      <Test />
    );

  });
});

describe("Chart", () => {
  it("", () => {
    mount(
      <Chart />
    );
  });
});
