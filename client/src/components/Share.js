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

function Share(props){
  const [isOpen, setIsOpen] = React.useState(false);

  function handleClick(){
    setIsOpen(true);
  }

  function handleTwitter(){
    window.open(`https://twitter.com/intent/tweet?url=${props.shareUrl}&via=Greenstand&related=Greestand,treetracker`);
  }

  function handleFaceBook(){
    window.open(`https://www.facebook.com/dialog/share?app_id=87741124305&href=${props.shareUrl}&display=popup`);
  }

  function handleEmail(){
    window.open(`https://www.facebook.com/dialog/share?app_id=87741124305&href=${props.shareUrl}&display=popup`);
  }

  return(
    <>
      <IconButton
        onClick={handleClick}
      >
        <ShareIcon/>
      </IconButton>
      <Dialog
        open={isOpen}
      >
        <DialogTitle>
          <Grid container justify="space-between" alignItems="center" >
            <Grid item xs={8} >
              Share
            </Grid>
            <Grid item>
              <Close/>
            </Grid>
          </Grid>
        </DialogTitle>
        <Grid container justify="center" >
          <Grid item>
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
                <a onClick={handleTwitter} >
                  <Typography variant="body" >
                    Twitter
                  </Typography>
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
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
                <a onClick={handleFaceBook} >
                  <Typography variant="body" >
                    Facebook
                  </Typography>
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" >
              <Grid item>
                <a href={`mailto:some@qq.com?subject=xxxx&body=hhhhhh`} >
                  <IconButton 
                    onClick={handleEmail}
                  >
                    <Avatar>
                      <Email/>
                    </Avatar>
                  </IconButton>
                </a>
              </Grid>
              <Grid item>
                <a onClick={handleEmail} >
                  <Typography variant="body" >
                    Email
                  </Typography>
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default Share;
