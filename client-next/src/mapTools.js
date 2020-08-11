/*
 * Some tool for map calculation
 */
import expect from "./expect";

function go(direction, location, degree){
  expect(direction).oneOf(["east", "west", "north", "south"]);
  expect(location).property("lat").number();
  expect(location).property("lng").number();
  expect(degree).number();
  const result = {lat: location.lat, lng: location.lng};
  if(direction === "east"){
    result.lng += degree;
  }else if(direction === "west"){
    result.lng -= degree;
  }else if(direction === "north"){
    result.lat += degree;
  }else if(direction === "south"){
    result.lat -= degree;
  }
  //correct
  if(direction === "east" || direction === "west"){
    if(result.lng > 180){
      result.lng = result.lng % 180 - 180;
    }else if(result.lng < -180){
      result.lng = result.lng % 180 + 180;
    }
  }else if(direction === "north" || direction === "south"){
    if(result.lat > 90){
      result.lat = 90 - result.lat % 90;
    }else if(result.lat < -90){
      result.lat = -result.lat % 90 - 90;
    }
  }
  return result;
};

function getAngleLng(east, west){
  let angle = east - west;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
};

function getAngleLat(north, south){
  let angle = north - south;
  console.log("angle:", angle);
  angle = Math.abs(angle);
  return angle;
};

/*
 * To calculate the initial bounds for some points/clusters, 
 * expressing(return value) by: 
 * {
 *    center: {
 *      lat: number,
 *      lng: number,
 *    },
 *    zoomLevel: number,
 * }
 *
 *
 */
function getInitialBounds (locations, width, height){
  expect(locations).lengthOf.above(0);
  locations.every(location => {
    expect(location).property("lat").number();
    expect(location).property("lng").number();
  });
  expect(width).above(0);
  expect(height).above(0);

  // If there is only a single cluster, create a bounding box centered on that cluster with a .1 degree latitude height and .1 degree longitude width
  if(locations.length === 1){
    const location = locations[0];
    const degrees = 0.005
    console.log(degrees);
    const cornerWestNorth = 
      go(
        "north",
        go("west", location, degrees),
        degrees
      );
    locations.push(cornerWestNorth);
    const cornerWestSouth = 
      go(
        "south",
        go("west", location, degrees),
        degrees
      );
    locations.push(cornerWestSouth);
    const cornerEastNorth = 
      go(
        "north",
        go("east", location, degrees),
        degrees
      );
    locations.push(cornerEastNorth);
    const cornerEastSouth = 
      go(
        "south",
        go("east", location, degrees),
        degrees
      );
    locations.push(cornerEastSouth);
  }

  const bounds = new google.maps.LatLngBounds();
  for(let location of locations){
    bounds.extend(location);
  }
  console.log("bounds:", bounds);
  const center = {
    lat: bounds.getCenter().lat(),
    lng: bounds.getCenter().lng(),
  }
  //cal zoom
  let zoom;
  var GLOBE_WIDTH = 256; // a constant in Google's map projection
  {
    const west = bounds.getSouthWest().lng();
    const east = bounds.getNorthEast().lng();
    const angle = getAngleLng(east, west);
    zoom = Math.round(Math.log(width * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    console.log("zoom1:", zoom);
  }
  let zoom2;
  {
    const south = bounds.getSouthWest().lat();
    const north = bounds.getNorthEast().lat();
    const angle = getAngleLat(north, south);
    console.log("angle:", angle);
    zoom2 = Math.round(Math.log(height * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    console.log("zoom2:", zoom2);
  }
  console.log("height:", height, "width:", width);
  const zoomFinal = Math.min(zoom, zoom2) - 1/* to give some padding*/;
  console.log("zoom final:", zoomFinal);
  const result =  {
    center,
    zoomLevel: zoomFinal,
  };
  console.log("result:", result);
  return result;
}

module.exports = {
  go,
  getAngleLat,
  getAngleLng,
  getInitialBounds,
};
