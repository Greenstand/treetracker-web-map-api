import React from "react"
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Close from "@material-ui/icons/Close";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Email from "@material-ui/icons/Email";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  box1:{
    padding: theme.spacing(4),
  },
  box2:{
    padding: theme.spacing(2),
  }
}));

function Share(props){
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);

  function handleClick(){
    setIsOpen(true);
  }

  function handleClose(){
    setIsOpen(false);
  }

  function handleTwitter(){
    window.open(`https://twitter.com/intent/tweet?url=${props.shareUrl}&via=Greenstand&related=Greestand,treetracker`);
  }

  function handleFaceBook(){
    window.open(`https://www.facebook.com/dialog/share?app_id=87741124305&href=${props.shareUrl}&display=popup`);
  }

  const mailString = `mailto:?subject=A tree from Greenstand&body=I want to share this tree from Greenstand with you, please click this linke to check it! ${props.shareUrl}`;

  return(
    <>
      <IconButton
        onClick={handleClick}
      >
        <ShareIcon/>
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>
          <Grid container justify="space-between" alignItems="center" >
            <Grid item xs={8} >
              Share
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose} >
                <Close/>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Grid container justify="center" className={classes.box1} >
          <Grid item className={classes.box2} >
            <Grid container direction="column" alignItems="center" >
              <Grid item>
                <IconButton 
                  onClick={handleTwitter}
                >
                  <Avatar
                    src="https://dadior.s3-ap-northeast-1.amazonaws.com/twitter2.svg" 
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="body" >
                  Twitter
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.box2} >
            <Grid container direction="column" alignItems="center" >
              <Grid item>
                <IconButton 
                  onClick={handleFaceBook}
                >
                  <Avatar
                    src="https://dadior.s3-ap-northeast-1.amazonaws.com/facebook.svg" 
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="body" >
                  Facebook
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.box2} >
            <Grid container direction="column" alignItems="center" >
              <Grid item>
                <a href={mailString} >
                  <IconButton 
                  >
                    <Avatar>
                      <Email/>
                    </Avatar>
                  </IconButton>
                </a>
              </Grid>
              <Grid item>
                <Typography variant="body" >
                  Email
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default Share;
