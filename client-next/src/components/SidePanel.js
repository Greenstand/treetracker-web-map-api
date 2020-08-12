import React from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Check from '@material-ui/icons/CheckCircle';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import AccessTime from '@material-ui/icons/AccessTime';
import Nature from '@material-ui/icons/Nature';
import Room from '@material-ui/icons/Room';
import moment from "moment";
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  sidePaper: {
    position: 'absolute',
    height: "100vh",
    width: 396,
    backgroundColor: "white",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100vw - 22px)",
    },
  },
  treePicture: {
    height: 300,
  },
  avatarPaper: {
    borderRadius: "50%",
  },
  avatar: {
    height: 108,
    width: 108,
    marginTop: -77,
    border: "6px solid white",
  },
  titleBox: {
    marginBottom: 15,
  },
  nameBox: {
    marginLeft: 15,
  },
  verify: {
    marginBottom: 15,
  },
  item: {
    marginBottom: 15,
  },
  card: {
    height: "100%",
  }, 
  arrowBox: {
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrow: {
    color: "white",
    fontSize: 36, 
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 34,
    margin: -23,
    width: 23,
    height: 48,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    cursor: "pointer",
  },
  infoItem: {
    marginBottom: 10,
    "&>div": {
      marginRight: 5,
    },
  },
}));


function SidePanel(props){
  const classes = useStyles();
  const {tree} = props;
  function handleClose(){
//    setPanel(false);
  }

  function handleNext(){
    console.log("next");
//    const {map} = mapRef.current;
//    expect(map).defined()
//      .property("getNextPoint")
//      .a(expect.any(Function));
//    const point = map.getNextPoint(tree);
//    expect(point).match({
//      id: expect.any(Number),
//    });
//    showPanel(point);
  }

  function handlePrev(){
//    const {map} = mapRef.current;
//    expect(map).defined()
//      .property("getPrevPoint")
//      .a(expect.any(Function));
//    const point = map.getPrevPoint(tree);
//    expect(point).match({
//      id: expect.any(Number),
//    });
//    showPanel(point);
  }
  return (
    <Paper square={true} className={classes.sidePaper} elevation={3}>
      <div style={{position: "relative"}} >
        <Paper onClick={handleClose} elevation={3} className={classes.closeButton} >
          <Grid container justify="center" alignItems="center" style={{height: "100%"}} >
            <Grid item>
              <ArrowLeft/> 
            </Grid>
          </Grid>
        </Paper>
      </div>
      <Card className={classes.card} >
        <CardMedia
          id="tree-img"
          className={classes.treePicture}
          image={/*"http://localhost:3000/images/tree.jpg"*/tree?.image_url}
        >
          <Grid container className={classes.arrowBox} >
            <Grid item>
              <IconButton title="previous tree" onClick={handlePrev} >
                <ArrowBackIosIcon className={classes.arrow} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton title="next tree" onClick={handleNext} >
                <ArrowForwardIosIcon className={classes.arrow} />
              </IconButton>
            </Grid>
          </Grid>
        </CardMedia>
        <CardContent>
          <Grid container className={classes.titleBox} >
            <Grid item>
              <Paper elevation={2} className={classes.avatarPaper} >
                <Avatar id="planter-img" className={classes.avatar} src={tree?.user_image_url} />
              </Paper>
            </Grid>
            <Grid item className={classes.nameBox} >
              <Typography variant="h4" >
                {tree && `${tree.first_name} ${tree.last_name.slice(0, 1)}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.verify} >
            <Grid item>
              <Check style={{ color: "#abe38f"}} />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" >
                Tree Verified{/*TODO wallet: token issued*/}
              </Typography>
            </Grid>
          </Grid>
          <Divider/>
          <Box height={15} />
          <Grid container className={classes.infoItem} >
            <Grid item>
              <AccessTime/>
            </Grid>
            <Grid item>
              <Typography className={classes.item} variant="body1" >
                {tree && moment(tree.time_created).format("MM/DD/YYYY hh:mm A")}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.infoItem} >
            <Grid item>
              <Nature/>
            </Grid>
            <Grid item>
              <Typography className={classes.item} variant="body1" >
                Tree Id: #{tree?.id}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.infoItem} >
            <Grid item>
              <Room />
            </Grid>
            <Grid item>
              <Typography className={classes.item} variant="body1" >
                {tree?.lat},{tree?.lng}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  );
}

export default SidePanel;
