const YES = "YES";
const NO = "NO";
var map = undefined;//Google Map object
var mc = undefined;//Marker Clusterer
var markers = [];//All the markers
var token;
var organization;
var clusterRadius;

var currentZoom;
var req = null;

var treetrackerApiUrl = "http://dev.treetracker.org/api/web/";
if (configTreetrackerApi) {
    treetrackerApiUrl = configTreetrackerApi;
}

//Get the tree data and create markers with corresponding data
var initMarkers = function (viewportBounds, clusterRadius) {
    console.log('Cluster radius: ' + clusterRadius);
    if (req != null) {
        req.abort();
    }
    var queryUrl = treetrackerApiUrl + "trees?clusterRadius=" + clusterRadius;
    if(currentZoom >= 4){ 
      queryUrl = queryUrl + "&bounds=" + viewportBounds;
    }
    if(token != null){
      queryUrl = queryUrl + "&token=" + token;
    } else if (organization != null){
      queryUrl = queryUrl + "&organization=" + organization;
    }
    req = $.get(queryUrl, function (data) {
        console.log('got data');

        clearOverlays(markers);
        //console.log(data);
        $.each(data.data, function (i, item) {
            if (item.type == 'cluster') {
                var centroid = JSON.parse(item.centroid);
                var latLng = new google.maps.LatLng(centroid.coordinates[1], centroid.coordinates[0]);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    label: {
                        text: item.count.toString(),
                        color: '#fff'
                    },
                    icon: {
                        url: './img/blank_pin.png',
                        labelOrigin: new google.maps.Point(20, 22)
                    }
                });

                google.maps.event.addListener(marker, 'click', function () {
                  var zoomLevel = map.getZoom();
                  map.setZoom(zoomLevel + 2);
                  map.panTo(marker.position);
                });
                // markerBounds.extend(latLng);
                markers.push(marker);
            } else if (item.type == 'point') {

                var latLng = new google.maps.LatLng(item.lat, item.lon);
                var infowindow = new google.maps.InfoWindow({
                    content: '/img/loading.gif'
                });

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: "Tree",
                    icon: {
                        url: './img/blank_pin.png'
                    }
                });

                google.maps.event.addListener(marker, 'click', function () {
                    var currentItem = item;

                    $("#tree_info_div").show("slide", "swing", 600);
                    $("#create-data").html(currentItem["time_created"]);
                    $("#updated-data").html(currentItem["time_updated"]);
                    $("#gps-accuracy-data").html(currentItem["gps_accuracy"]);
                    $("#latitude-data").html(currentItem["lat"]);
                    $("#longitude-data").html(currentItem["lon"]);
                    if (currentItem["missing"]) {
                        $("#missing-data").html(YES);
                    }
                    else {
                        $("#missing-data").html(NO);
                    }
                    if (currentItem["dead"]) {
                        $("#dead-data").html(YES);
                    }
                    else {
                        $("#dead-data").html(NO);
                    }
                    $("#tree-image").attr("src", currentItem["image_url"]);
                    $("#planter_name").html(currentItem["first_name"] + ' ' + currentItem["last_name"]); 
                    if(currentItem["user_image_url"]){
                      $("#planter_image").attr("src", currentItem["user_image_url"]);
                    } else {
                      $("#planter_image").attr("src", "img/portrait_placeholder_100.png");
                    }

                });

                // markerBounds.extend(latLng);
                markers.push(marker);
            }

        });

        //console.log('len: ' + markers.length);

    });
}

function clearOverlays(overlays) {
    //console.log(overlays);
    for (var i = 0; i < overlays.length; i++) {
        //console.log(i);
        overlays[i].setMap(null);
    }
    overlays.length = 0;
}

// Gets the value of a given querystring in the provided url
function getQueryStringValue(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Returns the bounds for the visible area of the map.
// The offset parameter extends the bounds resulting rectangle by a certain percentage.
// For example: 1.1 will return a rectangle with each point (N, S, E, W) 10% farther from the rectangle.
// The offset specification might be useful for preloading trees around the visible area, taking advantage of a single request.
function getViewportBounds(offset) {
    var bounds = map.getBounds();
    if (offset) {
        offset -= 1;
        var east = bounds.getNorthEast().lng();
        var west = bounds.getSouthWest().lng();
        var north = bounds.getNorthEast().lat();
        var south = bounds.getSouthWest().lat();
        // Get the longitude and latitude differences
        var longitudeDifference = (east - west) * offset;
        var latitudeDifference = (north - south) * offset;

        // Move each point farther outside the rectangle
        // To west
        bounds.extend(new google.maps.LatLng(south, west - longitudeDifference));
        // To east
        bounds.extend(new google.maps.LatLng(north, east + longitudeDifference));
        // To south
        bounds.extend(new google.maps.LatLng(south - latitudeDifference, west));
        // To north
        bounds.extend(new google.maps.LatLng(north + latitudeDifference, east));
    }
    return bounds;
}

function toUrlValueLonLat(bounds) {
    return [bounds.b.b, bounds.f.b, bounds.b.f, bounds.f.f].join();
}

function getClusterRadius(zoom) {
    switch (zoom) {
        case 4:
            return 4;
        case 5:
            return 0.8;
        case 6:
            return 0.75;
        case 7:
            return 0.3;
        case 8:
            return 0.099;
        case 9:
            return 0.095;
        case 10:
            return 0.05;
        case 11:
            return 0.03;
        case 12:
            return 0.02;
        case 13:
            return 0.008;
        case 14:
            return 0.005;
        case 15:
            return 0.004;
        case 16:
            return 0.003;
        case 17:
        case 18:
        case 19:
            return 0.000;
        default:
            return 0;
    }
}

//Initialize Google Maps and Marker Clusterer
var initialize = function () {
    var mapOptions = {
        zoom: parseInt(getQueryStringValue('zoom')) || 10,
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    }

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    token = getQueryStringValue('token') || null;
    organization = getQueryStringValue('organization') || null; 

    google.maps.event.addListener(map, "idle", function () {
      var zoomLevel = map.getZoom();
      clusterRadius = getQueryStringValue('clusterRadius') || getClusterRadius(zoomLevel);
      console.log('New zoom level: ' + zoomLevel);
      currentZoom = zoomLevel;
      initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), clusterRadius);
    });

    currentZoom = 0;
    map.setCenter({ lat: -3.33313276473463, lng: 37.142856230615735 });

}



google.maps.event.addDomListener(window, 'load', initialize);
