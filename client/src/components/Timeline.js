import React from "react";
import AccessTime from "@material-ui/icons/AccessTime";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Slider from '@material-ui/core/Slider';
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 9,
    position: "fixed",
    bottom: 15,
    left: 23,
  },
  box1: {
    width: theme.spacing(80),
  },
  box2: {
    width: theme.spacing(10),
  },
  box3: {
    width: theme.spacing(70),
  },
}));


function valuetext(value) {
  return moment('2015-01-01').add(value, "days").format("YYYY-MM-DD");
}

function Timeline(props){
  const classes = useStyles();
  const [slide, setSlide] = React.useState(false);

  function handleClick(){
    setSlide(!slide);
  }

  const dayRange = 365*5;

  const [value, setValue] = React.useState([0, dayRange]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return(
    <>
      <div className={classes.root} >
        <Grid 
          container
          alignItems="center"
          className={classes.box1}
        >
          <Grid item xs={1} className={classes.box2} >
            <IconButton onClick={handleClick} >
              <AccessTime fontSize="large" color="primary" />
            </IconButton>
          </Grid>
          <Grid item xs={3} className={classes.box3} >
            {slide &&
              <Slider
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={valuetext}
              valueLabelFormat={valuetext}
            />
            }
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Timeline;
