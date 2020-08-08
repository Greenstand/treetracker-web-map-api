import React from 'react';
import expect from "./expect";
import * as tools from "./tools";
import Paper from "@material-ui/core/Paper";
//import Grid from "@material-ui/core/Grid";
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import Menu from "@material-ui/icons/Menu";
import Search from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Check from '@material-ui/icons/CheckCircle';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

function shortenLargeNumber(number) {
  var units = ["K", "M"],
    decimal;

  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (number <= -decimal || number >= decimal) {
      return +(number / decimal).toFixed(0) + units[i];
    }
  }
  return number;
}

const dataString = '{"data":[{"type":"cluster","id":3,"centroid":{"type":"Point","coordinates":[116.677917,39.916175]},"region_type":21,"count":"3"},{"type":"cluster","id":6633370,"centroid":{"type":"Point","coordinates":[17.7059301432998,-0.750389389527574]},"region_type":21,"count":"49188"},{"type":"cluster","id":6633372,"centroid":{"type":"Point","coordinates":[134.005130433686,-26.6329991384479]},"region_type":21,"count":"45090"},{"type":"cluster","id":6633373,"centroid":{"type":"Point","coordinates":[25.1307668733496,55.5547728137252]},"region_type":21,"count":"1854"},{"type":"cluster","id":6633376,"centroid":{"type":"Point","coordinates":[-61.6849922603446,-18.4239591218155]},"region_type":21,"count":"1"},{"type":"cluster","id":6633382,"centroid":{"type":"Point","coordinates":[116.179439054975,63.2551984352121]},"region_type":21,"count":"391"},{"type":"cluster","id":6633383,"centroid":{"type":"Point","coordinates":[55.2021830908262,36.8891032742158]},"region_type":21,"count":"2154"},{"type":"cluster","id":6633386,"centroid":{"type":"Point","coordinates":[-100.166444768947,38.9003919231381]},"region_type":21,"count":"42392"}],"zoomTargets":[{"region_id":3,"most_populated_subregion_id":6633323,"total":"3","zoom_level":12,"centroid":{"type":"Point","coordinates":[116.677917,39.916175]}},{"region_id":6633370,"most_populated_subregion_id":6633323,"total":"14459","zoom_level":4,"centroid":{"type":"Point","coordinates":[23.6413186472675,-2.87819918226245]}},{"region_id":6633372,"most_populated_subregion_id":6633327,"total":"45090","zoom_level":4,"centroid":{"type":"Point","coordinates":[135.861287249936,-30.0830623575016]}},{"region_id":6633373,"most_populated_subregion_id":6633356,"total":"1353","zoom_level":4,"centroid":{"type":"Point","coordinates":[25.5752943938719,49.390422739306]}},{"region_id":6633376,"most_populated_subregion_id":6633156,"total":"1","zoom_level":4,"centroid":{"type":"Point","coordinates":[-65.1428660145168,-35.5033113327271]}},{"region_id":6633381,"most_populated_subregion_id":6633329,"total":"1112","zoom_level":4,"centroid":{"type":"Point","coordinates":[103.819073145824,36.5617653792527]}},{"region_id":6633382,"most_populated_subregion_id":6633144,"total":"892","zoom_level":4,"centroid":{"type":"Point","coordinates":[96.3271098688591,61.9564537229541]}},{"region_id":6633383,"most_populated_subregion_id":6633291,"total":"651","zoom_level":4,"centroid":{"type":"Point","coordinates":[54.2693195362499,32.583397353079]}},{"region_id":6633386,"most_populated_subregion_id":6633365,"total":"42392","zoom_level":4,"centroid":{"type":"Point","coordinates":[-114.148167209111,42.1252695324697]}}]}';

const dataString2 = '{"data":[{"type":"point","id":1,"lng": 116.677917, "lat":39.916175},{"type":"point","id":2,"lng": 116.657892, "lat":39.912553},{"type":"point","id":3,"lng": 116.657738, "lat":39.912228}]}';


const useStyles = makeStyles({
  paper: {
    position: 'absolute',
    marginTop: 8,
    marginLeft: 8,
    padding: 2,
    //width: 392,
    borderRadius: 8,
    zIndex: 2,
  },
  searchInput: {
    borderWidth: 0,
    marginLeft: 20,
    fontSize: 16,
    width: 250,
  },
  sidePaper: {
    position: 'absolute',
    height: "100vh",
    width: 396,
    backgroundColor: "white",
    zIndex: 1,
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
});

function App() {
  console.warn("Reander ................ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  const classes = useStyles();
  const [isPanel, setPanel] = React.useState(false);
  const [tree, setTree] = React.useState(undefined);
  const mapRef = React.useRef(null);

  function handlePrev(){
    console.log("prev");
  }

  function handleNext(){
    console.log("next");
    const {markers} = mapRef.current;
    expect(markers).defined();
    expect(tree.id).number();
    const index = markers.reduce((a,c,i) => {
      expect(c.payload.id).number();
      if(c.payload.id === tree.id){
        return i;
      }else{ 
        return a;
      }
    }, -1);
    expect(index).least(0);
    const next = markers[(index + 1) % markers.length]
    setTree(next.payload);
    //move the map
    expect(next.payload.lat).number();
    expect(next.payload.lng).number();
    const {greenstandMap} = mapRef.current;
    expect(greenstandMap).defined();
    greenstandMap.panTo({
      lat: next.payload.lat,
      lng: next.payload.lng,
    });
  }

  function handleClose(){
    setPanel(false);
  }

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDUGv1-FFd7NFUS6HWNlivbKwETzuIPdKE&libraries=geometry';
    script.id = 'googleMaps';
    document.body.appendChild(script);

    script.onload = () => {
      var mapOptions = {
        zoom: 2,
        //minZoom: minZoom,
        mapTypeId: "hybrid",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      console.log("to load google map with:", mapOptions);


      const map = new window.google.maps.Map(document.getElementById("map-canvas"), {
        mapTypeControl: false,
        center: { lat: 20, lng: 0},
        zoom: 2,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeId: "hybrid",
      });

      mapRef.current.greenstandMap = map;
      mapRef.current.markers = [];

      window.google.maps.event.addListenerOnce(map,"tilesloaded", function(){
        const data = JSON.parse(dataString);
        data.data.forEach(d => {
          expect(d.centroid)
            .defined()
            .property("coordinates")
            .property(1)
            .number();
          const latLng = new window.google.maps.LatLng(
            d.centroid.coordinates[1],
            d.centroid.coordinates[0]
          );
          expect(d.count).match(/\d+/);
          const marker = new window.google.maps.Marker({
            position: latLng,
            map: map,
            //animation: window.google.maps.Animation.BOUNCE,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: tools.scale(d.count),
              fillColor: "#85c232",
              fillOpacity: 0.3,
              strokeWeight: 1,
              strokeColor: "#85c232",
            },
            label: {
              text: shortenLargeNumber(d.count).toString(),
              color: "#ffffff",
              fontSize: tools.scaleFontSize(d.count) + "px",
            },
          });
          marker.zoomTarget = data.zoomTargets?.reduce((a,c) => {
            if(a){
              return a;
            }else{
              if(c.region_id === d.id){
                console.error("xxxxxxxxxxxxxxxxx");
                return c;
              }else{
                return a;
              }
            }
          }, undefined);
          window.google.maps.event.addListener(marker, "mouseover", function(){
            const icon = marker.getIcon();
            icon.scale += 5;
            icon.fillColor = "#c3f184";
            icon.strokeColor = "#c3f184";
            marker.setIcon(icon);
          });
          window.google.maps.event.addListener(marker, "mouseout", function(){
            const icon = marker.getIcon();
            icon.scale -= 5;
            icon.fillColor = "#85c232";
            icon.strokeColor = "#85c232";
            marker.setIcon(icon);
          });
          window.google.maps.event.addListener(marker, "click", function(){
            console.log("click", marker);
            expect(marker.zoomTarget).match({
              zoom_level: expect.any(Number),
              centroid: {
                coordinates: expect.any(Array),
              },
            });
            map.setZoom(marker.zoomTarget.zoom_level);
            map.panTo({
              lat: marker.zoomTarget.centroid.coordinates[1],
              lng: marker.zoomTarget.centroid.coordinates[0],
            });
            //remove all markers and insert trees
            mapRef.current.markers.forEach(marker => {
              marker.setMap(null);
            });
            mapRef.current.markers = [];
            const data2 = JSON.parse(dataString2);
            expect(data2).match({
              data: expect.any(Array),
            });
            data2.data.forEach(item => {
              console.log("add tree:", item);
              expect(item).match({
                lat: expect.any(Number),
                lng: expect.any(Number),
              });
              const marker = new window.google.maps.Marker({
                position: {
                  lat: item.lat,
                  lng: item.lng,
                },
//                icon: {
//                  path: "M213.333,0C130.88,0,64,66.88,64,149.333c0,112,149.333,277.333,149.333,277.333s149.333-165.333,149.333-277.333 C362.667,66.88,295.787,0,213.333,0z M213.333,202.667c-29.44,0-53.333-23.893-53.333-53.333S183.893,96,213.333,96 s53.333,23.893,53.333,53.333S242.773,202.667,213.333,202.667z",
//                  fillColor: '#FF0000',
//                  fillOpacity: 1,
//                  anchor: new window.google.maps.Point(0,0),
//                  strokeWeight: 0,
//                  scale: .1,
//                },
                icon:{
                  url: "http://localhost:3000/marker.svg",
                  scaledSize: new window.google.maps.Size(40, 60),
                },
                map: map,
//                label: {
//                  text: "tree" + item.id,
//                },
                payload: {
                  ...item,
                },
              });
              window.google.maps.event.addListener(marker, "mouseover", function(){
                const icon = marker.getIcon();
                icon.url = "http://localhost:3000/marker2.svg";
                marker.setIcon(icon);
              });
              window.google.maps.event.addListener(marker, "mouseout", function(){
                const icon = marker.getIcon();
                icon.url = "http://localhost:3000/marker.svg";
                marker.setIcon(icon);
              });
              window.google.maps.event.addListener(marker, "click", function(){
                expect(marker.payload.id).number();
                console.log("click tree", marker.payload.id);
                setPanel(true);
                setTree(marker.payload);
                //move map
                expect(marker.payload.lat).number();
                expect(marker.payload.lng).number();
                const position = {
                  lat: marker.payload.lat,
                  lng: marker.payload.lng,
                }
                console.log("pan to:", position); 
                map.panTo(position);
              });
              marker.triggerClick = () => {
                window.google.maps.event.trigger(marker, "click");
              }
              mapRef.current.markers.push(marker);
              console.log("added marker:", marker, marker.getPosition().toJSON());
            });
          });
          marker.triggerClick = () => {
            window.google.maps.event.trigger(marker, "click");
          }
          mapRef.current.markers.push(marker);
        });
      });
    };
  }, []);

  return (
    <div>
      {isPanel &&
        <div className="side" >
          Dadior Chen
          Tree #{tree?.id}
          <div><a onClick={handlePrev} href="javascript:" >prev</a></div>
          <div><a onClick={handleNext} href="javascript:" >next</a></div>
          <div><button onClick={handleClose} >close</button></div>
        </div>
      }
      <div className="side-panel" >
      <Paper className={classes.paper} elevation={2}>
        <Grid container alignItems="center" wrap="nowrap" >
          <Grid item>
            <IconButton>
              <Menu/>
            </IconButton>
          </Grid>
          <Grid item>
            <input className={classes.searchInput} type="text" placeholder="Search Greenstand" /> 
          </Grid>
          <Grid item>
            <IconButton>
              <Search/>
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      <Paper square={true} className={classes.sidePaper} elevation={3}>
        <Card className={classes.card} >
          <CardMedia
            className={classes.treePicture}
            image="http://localhost:3000/images/tree.jpg"
          >
            <Grid container className={classes.arrowBox} >
              <Grid item>
                <IconButton>
                  <ArrowBackIosIcon className={classes.arrow} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <ArrowForwardIosIcon className={classes.arrow} />
                </IconButton>
              </Grid>
            </Grid>
          </CardMedia>
          <CardContent>
            <Grid container className={classes.titleBox} >
              <Grid item>
                <Paper elevation={2} className={classes.avatarPaper} >
                  <Avatar className={classes.avatar} src="http://localhost:3000/images/avatar.jpg" />
                </Paper>
              </Grid>
              <Grid item className={classes.nameBox} >
                <Typography variant="h4" >Clyde V</Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.verify} >
              <Grid item>
                <Check style={{ color: "#abe38f"}} />
              </Grid>
              <Grid item>
                <Typography variant="body1" >
                  Tree Verified
                </Typography>
              </Grid>
            </Grid>
            <Typography className={classes.item} variant="body2" >
              09/28/2019 05:15 PM
            </Typography>
            <Typography className={classes.item} variant="body2" >
              Tree Id: 183674
            </Typography>
          </CardContent>
        </Card>
      </Paper>
      </div>
      <div className="map" id="map-canvas" ref={mapRef}/>
      <div className="logo">
        <img alt="logo" src={require("./images/logo_floating_map.svg")} />
      </div>
    </div>
  );
}

export default App;
