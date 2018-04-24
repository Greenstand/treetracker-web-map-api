const YES = "YES";
const NO = "NO";
var map = undefined;//Google Map object
var mc = undefined;//Marker Clusterer
var markers = [];//All the markers
// var markerBounds = new google.maps.LatLngBounds();//Marker bounds

var currentZoom;

var treetrackerApiUrl = "http://dev.treetracker.org/api/";
// console.log(configTreetrackerApi);
// if (configTreetrackerApi) {
//     treetrackerApiUrl = configTreetrackerApi;
// }

//Get the tree data and create markers with corresponding data
var initMarkers = function (token, viewportBounds) {
    var zoomLevel = map.getZoom();
    console.log(zoomLevel);
    $.get(treetrackerApiUrl + "trees?zoom=" + zoomLevel + "&token=" + token + "&bounds=" + viewportBounds, function (data) {
        console.log('got data');

        /*var oldMarkers = $.extend({}, markers);
          markers.length = 0;
          console.log('oldMarkers ' + oldMarkers.length);
         */
        clearOverlays(markers);
        //console.log(data);
        $.each(data.data, function (i, item) {

            var gridColorValues = {
                5: "pink",
                10: "lightcoral",
                50: "coral",
                100: "orange",
                1000: "orangered",
                10000: "red"
            }

            //set marker sizes according to your images for correct display
            var markerImageSizes = {
                1: google.maps.Size(24, 39),
                5: google.maps.Size(30, 30),
                10: google.maps.Size(30, 30),
                50: google.maps.Size(40, 40),
                100: google.maps.Size(40, 40),
                1000: google.maps.Size(50, 50),
            }

            if (item.type == 'cluster') {
                //alert(item.circle);
                //feature = ' { "type": "FeatureCollection", "features": [ { "type": "Feature", "geometry":  ' + item.centroid + ' } ] }';
                //feature = JSON.parse(feature);
                //map.data.addGeoJson(feature);
                centroid = JSON.parse(item.centroid);
                //console.log(centroid);
                var latLng = new google.maps.LatLng(centroid.coordinates[1], centroid.coordinates[0]);
                // console.log(latLng);

                var count = item.count;
                var pinicon;
                if (count > 1000) {
                    pinicon = '1000';
                } else if (count > 100) {
                    pinicon = '100';
                } else if (count > 50) {
                    pinicon = '50';
                } else if (count > 10) {
                    pinicon = '10';
                } else {
                    pinicon = '5';
                }
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: "Count",
                    count: count,
                    icon: {
                        url: './img/' + pinicon + '.png',
                        size: markerImageSizes[pinicon]
                    }
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
                        url: './img/blank_pin.png',
                        size: markerImageSizes[pinicon]
                    }
                });

                google.maps.event.addListener(marker, 'click', function () {
                    var currentItem = item;
                    //infowindow.open(map, this);
                    console.log(currentItem);

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

function getUrlToken() {
    return getParameterByName("token", window.location.href) || "";
}

// Gets the value of a given querystring in the provided url
function getParameterByName(name, url) {
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

//google.maps.geometry.spherical.computeDistanceBetween(map.getBounds().getNorthEast(),map.getBounds().getSouthWest())

//Initialize Google Maps and Marker Clusterer
var initialize = function () {
    var mapOptions = {
        zoom: 4,
        mapTypeId: 'hybrid'
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var mcOptions = { gridSize: 50, maxZoom: 13 };

    google.maps.event.addListener(map, "idle", function () {
        console.log('idle');
        var zoomLevel = map.getZoom();
        if ((currentZoom < 14 && zoomLevel >= 14)
            || (currentZoom >= 14 && zoomLevel < 14)) {
            console.log('reload');
            initMarkers(getUrlToken(), getViewportBounds(1.1).toUrlValue());
        }
        currentZoom = zoomLevel;
    });

    currentZoom = 0;
    map.setCenter({ lat: -3.263960, lng: 36.624882 });
    map.setZoom(15);

}

google.maps.event.addDomListener(window, 'load', initialize);