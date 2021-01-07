import React from "react";
import Chart from "./Chart.js";
import {makeStyles} from "@material-ui/core/styles";
import G from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import T from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import log from "loglevel";
import expect from "expect-runtime";

const treetrackerApiUrl = process.env.REACT_APP_API || "/api/web/";


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
  expect(props).property("walletName").a("string");
  const classes = useStyles();
  const [wallet, setWallet] = React.useState(undefined);

  React.useEffect(() => {
    //load data from server
    axios.get(`${treetrackerApiUrl}/wallets/${props.walletName}`)
      .then(res => {
        log.debug("get response from server");
        expect(res).property("data").match({
          name: expect.any("string"),
        });
        setWallet(res.data);
//        const {data} = res;
//        if (userid && data.data.length === 0) {
//          showAlert();
//        }
      });
  }, []);

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
                {wallet && wallet.name}
              </T>
            </G>
          </G>
        </G>
        <G item className={classes.containerC} >
          <T variant="caption" >
            Total tokens
          </T>
          <T variant="body2" className={classes.text} >
            {wallet && wallet.tokens.total}
          </T>
          <T variant="caption" >
            Total planters
          </T>
          <T variant="body2" className={classes.text} >
            {wallet && wallet.planters.total}
          </T>
          <T variant="caption" >
            Total species
          </T>
          <T variant="body2" className={classes.text} >
            {wallet && wallet.species.total}
          </T>
        </G>
        <G item className={classes.containerD} >
          {wallet && 
            <Chart label="tokens" data={wallet.tokens.monthly.map(e => ({x: e.mon, y:e.count}))} />
          }
        </G>
        <G item className={classes.containerD} >
          {wallet && 
            <Chart label="planters" data={wallet.planters.monthly.map(e => ({x: e.mon, y:e.count}))} />
          }
        </G>
        <G item className={classes.containerD} >
          {wallet && 
            <Chart label="species" data={wallet.species.monthly.map(e => ({x: e.mon, y:e.count}))} />
          }
        </G>
      </G>
    </Paper>
  );
}

export default BottomPanel;
