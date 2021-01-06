import React from "react";
import Chart from "./Chart.js";
import {makeStyles} from "@material-ui/core/styles";
import G from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import T from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  containerA: {
    padding: theme.spacing(2),
  },
  containerB: {
    flexDirection: "column",
    marginRight: theme.spacing(2),
  },
  containerC: {
    marginLeft: theme.spacing(2),
  },
  containerD: {
    marginLeft: theme.spacing(4),
  },
  text: {
    fontWeight: 700,
  },
}));

function BottomPanel(props){
  const classes = useStyles();

  return (
    <Paper elevation={4} >
      <G container className={classes.containerA} >
        <G item>
          <G container className={classes.containerB} >
            <G item>
              <T variant="caption" >
                Impact owner 
              </T>
            </G>
            <G item>
              <T variant="h6" >
                Anna Eye
              </T>
            </G>
          </G>
        </G>
        <G item className={classes.containerC} >
          <T variant="caption" >
            Total tokens
          </T>
          <T variant="body2" className={classes.text} >
            1000k
          </T>
          <T variant="caption" >
            Total species
          </T>
          <T variant="body2" className={classes.text} >
            100
          </T>
          <T variant="caption" >
            Total planters
          </T>
          <T variant="body2" className={classes.text} >
            10
          </T>
        </G>
        <G item className={classes.containerD} >
          <Chart label="tokens" />
        </G>
        <G item className={classes.containerD} >
          <Chart label="planters" />
        </G>
        <G item className={classes.containerD} >
          <Chart label="species" />
        </G>
      </G>
    </Paper>
  );
}

export default BottomPanel;
