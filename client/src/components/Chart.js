import React from "react";
import ChartJs from "chart.js";

function Chart(props){
  const refCanvas = React.useRef();
  const config = {
    type: "line",
    data: {
      labels: ['Jan', '', 'Mar', '', 'May', '', 'Jul'],
      datasets: [{
        label: props.label,
        data: [1, 2, 2, 3, 5, 5, 7],
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

export default Chart;
