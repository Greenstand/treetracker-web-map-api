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
import LinearProgress from "@material-ui/core/LinearProgress";
import Slide from "@material-ui/core/Slide";
import expect from "expect-runtime";

const useStyles = makeStyles(theme => ({
  placeholder:{
    position: 'absolute',
    height: "100vh",
    width: 396,
    backgroundColor: "#d8d7d7",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100vw - 22px)",
    },
    left: 0,
  },
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
  progress: {
    position: "absolute",
    width: "100%",
    zIndex: 9,
  },
  pictureBox: {
    position: "relative",
  },
  backgroundBox: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    fontWeight: 700,
    fontFamily: "roboto",
    //color: "#d4d4d4",
    color: "#bebcbc",
    letterSpacing: "1px",
    //textShadow: "1px 1px 2px #ffffff, -1px -1px 1px #4d4c4c",
    background: "#d4d4d4",
    height: 300,
  },
  treePictureBox: {
    top: 0,
    left: 0,
    position: "absolute",
    height: 300,
  },
  treePicture: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
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
    position: "absolute",
    zIndex: 19,
    top: 0,
    height: 300,
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
    opacity: .8,
  },
  showButton: {
    position: "absolute",
    left: 0,
    top: 34,
    margin: -23,
    marginLeft: 0,
    width: 23,
    height: 48,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    cursor: "pointer",
    opacity: .8,
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
  const {tree, state} = props;
  expect(state).oneOf(["none", "show", "hide"]);
  const {hasPrevious = true} = props;
  const {hasNext = true} = props;
  const [isTreePictureLoaded, setTreePictureLoaded] = React.useState((tree && tree.image_url)?false:true);

  function handleClose(){
    props.onClose();
  }

  function handleShow(){
    props.onShow();
  }

  function handleLoad(){
    console.log("loaded....");
    setTreePictureLoaded(true);
  }

  React.useEffect(() => {
    console.log("tree changed"); 
    if(tree && tree.image_url){
      setTreePictureLoaded(false);
    }
  }, [props.tree]);

  if(tree === undefined){
    return null;
  }

  return (
    <>
    <Slide in={state === "show"} direction="right" >
      <Paper square={true} className={classes.sidePaper} elevation={3}>
        <div style={{position: "relative"}} >
          <Paper title="hide" onClick={handleClose} elevation={3} className={classes.closeButton} >
            <Grid container justify="center" alignItems="center" style={{height: "100%"}} >
              <Grid item>
                <ArrowLeft/> 
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Card className={classes.card + ` ${isTreePictureLoaded?"treePictureLoaded":"treePictureLoading"}`} >
          {!isTreePictureLoaded &&
            <LinearProgress className={classes.progress} />
          }
          <div className={classes.pictureBox} >
            <Grid container className={classes.backgroundBox}>
              <Box>GREENSTAND</Box>
            </Grid>
            <div className={classes.treePictureBox} >
              {tree && tree.image_url &&
                <img key={tree.id} id="tree_img" onLoad={handleLoad} className={classes.treePicture} alt="tree planted" src={tree.image_url} />
              }
            </div>
          </div>
          <Grid container className={classes.arrowBox} >
            <Grid item>
              {hasPrevious &&
                <IconButton title="previous tree" onClick={props.onPrevious} >
                  <ArrowBackIosIcon className={classes.arrow} />
                </IconButton>
              }
            </Grid>
            <Grid item>
              {hasNext &&
                <IconButton title="next tree" onClick={props.onNext} >
                  <ArrowForwardIosIcon className={classes.arrow} />
                </IconButton>
              }
            </Grid>
          </Grid>
          <CardContent>
            <Grid container className={classes.titleBox} >
              <Grid item>
                <Paper elevation={8} className={classes.avatarPaper} >
                  <Avatar id="planter-img" className={classes.avatar} src={tree.user_image_url || require("../images/greenstand_logo.svg")} />
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
    </Slide>
    <div style={{position: "relative"}} >
      <Paper title="show" onClick={handleShow} elevation={3} className={classes.showButton} >
        <Grid container justify="center" alignItems="center" style={{height: "100%"}} >
          <Grid item>
            <ArrowRight/> 
          </Grid>
        </Grid>
      </Paper>
    </div>
    </>
  );
}

export default SidePanel;
