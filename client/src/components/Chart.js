import React from "react";
import ChartJs from "chart.js";
import expect from "expect-runtime";

function Chart(props){
  expect(props).property("data").match([{
    x: expect.any("string"),
    y: expect.stringMatching(/\d+/),
  }]);
  const refCanvas = React.useRef();
  const config = {
    type: "line",
    data: {
      datasets: [{
        label: props.label,
        data: props.data,
        fill: false,
        backgroundColor: "#FFA500",
        borderColor: "#FFA500",
      }],
    },
    options: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: props.label,
      },
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 5,
          }
        }],
        xAxes: [{
          type: "time",
          time: {
            unit: "month",
            displayFormats: {
              month: "MMM",
            },
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 4,
            maxRotation: 0,
          }
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
      <canvas ref={refCanvas} ></canvas>
    </div>
  );
}

export default Chart;
