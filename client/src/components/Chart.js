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
      }],
    },
    options: {
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
      <canvas ref={refCanvas} width="220px" height="120px" ></canvas>
    </div>
  );
}

export default Chart;
