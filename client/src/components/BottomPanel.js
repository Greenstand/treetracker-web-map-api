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
import Skeleton from "@material-ui/lab/Skeleton";
import ArrowLeft from "@material-ui/icons/ArrowLeft";

const treetrackerApiUrl = process.env.REACT_APP_API || "/api/web/";


const useStyles = makeStyles(theme => ({
  boxA: {
    height: theme.spacing(40),
    zIndex: 999,
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  containerA: {
    padding: theme.spacing(2),
    marginLeft: theme.spacing(8),
  },
  containerB: {
    width: theme.spacing(40),
    minWith: theme.spacing(10),
    flexDirection: "column",
    marginRight: theme.spacing(2),
  },
  containerC: {
    width: theme.spacing(30),
    marginLeft: theme.spacing(2),
  },
  containerD: {
    marginLeft: theme.spacing(4),
    width: theme.spacing(75),
    height: theme.spacing(37),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: 500,
  },
  closeButton: {
    position: "absolute",
    right: "50%",
    top: -34,
    width: 23,
    height: 48,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    cursor: "pointer",
    transform: "rotate(90deg)",
    boxShadow: "0px 3px 0px -1px rgba(0,0,0,0.05), 0px 3px 0px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.1)",
    "& svg": {
      transform: "rotate(180deg)",
      fill: "#86c232",
      marginTop: 3,
    },
  },
  closeButtonB: {
    "& svg": {
      transform: "rotate(0deg)",
    },
  },
}));

const BottomPanel = React.forwardRef((props, ref) => {
  expect(props).property("walletName").a("string");
  const classes = useStyles();
  const [wallet, setWallet] = React.useState(undefined);
  const [isHidden, setHidden] = React.useState(false);
  const panelRef = React.useRef();

  function handleClose(){
    setHidden(true);
    props.onHeightChange && props.onHeightChange(0);
  }

  function handleOpen(){
    setHidden(false);
    //TODO can optimize
    setTimeout(() => {
      expect(panelRef.current).property("clientHeight").a("number").above(0);
      props.onHeightChange && props.onHeightChange(panelRef.current.clientHeight);
    }, 10);
  }

  React.useEffect(() => {
    expect(panelRef.current).property("clientHeight").a("number").above(0);
    props.onHeightChange && props.onHeightChange(panelRef.current.clientHeight);
  }, []);

  React.useEffect(() => {
    //load data from server
    axios.get(`${treetrackerApiUrl}wallets/${props.walletName}`)
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
    <div ref={ref}  >
      {!isHidden &&
        <Paper elevation={4} ref={panelRef} className={classes.boxA} >
          <div style={{position: "relative"}} >
            <Paper title="hide" onClick={handleClose} elevation={3} className={classes.closeButton} >
              <G container justify="center" alignItems="center" style={{height: "100%"}} >
                <G item>
                  <ArrowLeft /> 
                </G>
              </G>
            </Paper>
          </div>
          <G container className={classes.containerA} >
            <G item>
              <G container className={classes.containerB} >
                <G item>
                  <T variant="caption" >
                    IMPACT OWNER 
                  </T>
                </G>
                <G item>
                  <T variant="h6" >
                    {wallet && wallet.name || <Skeleton/> }
                  </T>
                </G>
              </G>
            </G>
            <G item className={classes.containerC} >
              <T variant="caption" >
                Total tokens
              </T>
              <T variant="body2" className={classes.text} >
                {wallet && wallet.tokens.total || <Skeleton/> }
              </T>
              <T variant="caption" >
                Total planters
              </T>
              <T variant="body2" className={classes.text} >
                {wallet && wallet.planters.total || <Skeleton/> }
              </T>
              <T variant="caption" >
                Total species
              </T>
              <T variant="body2" className={classes.text} >
                {wallet && wallet.species.total || <Skeleton/> }
              </T>
            </G>
            <G item className={classes.containerD} >
              {wallet && 
                <Chart label="tokens" data={wallet.tokens.monthly.map(e => ({x: e.mon, y:e.count}))} />
                ||
                <Skeleton variant="rect" component="div" width="70%" height="70%" />
              }
            </G>
            <G item className={classes.containerD} >
              {wallet && 
                <Chart label="planters" data={wallet.planters.monthly.map(e => ({x: e.mon, y:e.count}))} />
                ||
                <Skeleton variant="rect" component="div" width="70%" height="70%" />
              }
            </G>
            <G item className={classes.containerD} >
              {wallet && 
                <Chart label="species" data={wallet.species.monthly.map(e => ({x: e.mon, y:e.count}))} />
                ||
                <Skeleton variant="rect" component="div" width="70%" height="70%" />
              }
            </G>
          </G>
        </Paper>
      }
      {isHidden &&
        <div style={{position: "relative"}} >
          <Paper title="hide" onClick={handleOpen} elevation={3} className={`${classes.closeButton} ${classes.closeButtonB}`} >
            <G container justify="center" alignItems="center" style={{height: "100%"}} >
              <G item>
                <ArrowLeft/> 
              </G>
            </G>
          </Paper>
        </div>
      }
    </div>
  );
})

export default BottomPanel;
