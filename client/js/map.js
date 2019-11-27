const YES = "YES";
const NO = "NO";
var map = undefined;//Google Map object
var mc = undefined;//Marker Clusterer
var markers = [];//All the markers
var token;
var organization;
var treeid;
var userid;
var flavor;
var clusterRadius;
var firstRender = true;
var firstInteraction = false;
var initialBounds = new google.maps.LatLngBounds();
var loader;
var panelLoader;

var currentZoom;
var req = null;
var treeInfoDivShowing = false;
var fetchMarkers = true;

// used to keep track of our points and markers
var points = [];
var markerByPointId = {};
var selectedTreeMarker;
var selectedOldTreeMarker;

var treetrackerApiUrl = "http://dev.treetracker.org/api/web/";

if (configTreetrackerApi) {
    treetrackerApiUrl = configTreetrackerApi;
}

//Get the tree data and create markers with corresponding data
var initMarkers = function (viewportBounds, zoomLevel) {

    // no need to load this up at every tiny movement
    if(!fetchMarkers) {
        return;
    }

    clusterRadius = getQueryStringValue('clusterRadius') || getClusterRadius(zoomLevel);

    console.log('Cluster radius: ' + clusterRadius);
    if (req != null) {
        req.abort();
    }
    var queryUrl = treetrackerApiUrl + "trees?clusterRadius=" + clusterRadius;
    queryUrl = queryUrl + "&zoom_level=" + zoomLevel;
    if (currentZoom >= 4 && !((token != null || organization != null || treeid != null || userid !== null) && firstRender == true)) {
        queryUrl = queryUrl + "&bounds=" + viewportBounds;
    }
    if (token != null) {
        queryUrl = queryUrl + "&token=" + token;
    } else if (organization != null) {
        queryUrl = queryUrl + "&organization=" + organization;
    } else if (treeid != null) {
        queryUrl = queryUrl + "&treeid=" + treeid;
    } else if (userid != null) {
        queryUrl = queryUrl + "&userid=" + userid;
    } else if (flavor != null) {
        queryUrl = queryUrl + "&flavor=" + flavor;
    }

    req = $.get(queryUrl, function (data) {
      if (userid && data.data.length === 0) {
        showAlert();
      }

        // clear everything
        points = [];
        markerByPointId = {};
        clearOverlays(markers);
        // console.log(data);

        $.each(data.data, function (i, item) {
            if (item.type == 'cluster') {
                var centroid = JSON.parse(item.centroid);
                var latLng = new google.maps.LatLng(centroid.coordinates[1], centroid.coordinates[0]);
                determineInitialSize(latLng);

                var iconUrl = null, labelOrigin = null, anchor = null;
                if(item.count <= 300){
                    iconUrl = './img/cluster_46px.png';
                    labelOrigin = new google.maps.Point(23, 23);
                    anchor = new google.maps.Point(23, 23);
                } else {
                    iconUrl = './img/cluster_63px.png';
                    labelOrigin = new google.maps.Point(32, 32);
                    anchor = new google.maps.Point(32, 32);
                }

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    label: {
                        text: shortenLargeNumber(item.count).toString(),
                        color: '#000'
                    },
                    icon: {
                        url: iconUrl,
                        labelOrigin: labelOrigin,
                        anchor: anchor
                    }
                });

                google.maps.event.addListener(marker, 'click', function () {
                    fetchMarkers = false
                    var zoomLevel = map.getZoom();
                    map.setZoom(zoomLevel + 2);
                    map.panTo(marker.position);
                });
                markers.push(marker);
            } else if (item.type == 'point') {

                var latLng = new google.maps.LatLng(item.lat, item.lon);
                determineInitialSize(latLng);
                var infowindow = new google.maps.InfoWindow({
                    content: '/img/loading.gif'
                });

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: "Tree",
                    icon: {
                        url: './img/pin_29px.png'
                    },
                    zIndex: undefined,
                    payload: {
                        id: item["id"]
                    }
                });


                if ((selectedTreeMarker) && (marker.payload.id === selectedTreeMarker.payload.id)) {
                    selectedTreeMarker = marker;
                    changeTreeMarkSelected();
                }

                // set the field for sorting
                item._sort_field = new Date(item.time_created);

                // hold the reference to our points
                points.push(item);
                markerByPointId[item["id"]] = marker;
                markers.push(marker);
            }
        });

        // set the markers once we are done
        setPointMarkerListeners();

        if (firstRender) {
          if (data.data.length > 0 &&
            (organization != null || token != null || treeid != null || userid != null)) {
              map.fitBounds(initialBounds);
              map.setCenter(initialBounds.getCenter());
              map.setZoom(map.getZoom() - 1);
              if (map.getZoom() > 15) {
                  map.setZoom(15);
              }
          }

          loader.classList.remove('active');
          firstRender = false;
        }

    });
}

// for each point, set the listeners.
// sort first so we can reference the next point
// in chronological order
function setPointMarkerListeners() {
   // points.sort(function(a, b) {
   //     return a._sort_field - b._sort_field;
   // });

    panelLoader = document.getElementById('tree-info-loader');

    $.each(points, function(i, point){
        var marker = markerByPointId[point.id];
        google.maps.event.addListener(marker, 'click', function () {

            panelLoader.classList.add('active');
            showMarkerInfo(point, marker, i);
            $("#tree-image").on('load', function() {
              panelLoader.classList.remove('active');
            })

        });
    })
}

function showAlert() {
  const alertHtml = `
    <div class="alert alert-info alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      Could not find any trees associated with userid ${userid}
    </div>
  `;
  // Prevent duplicate alerts after map is re-rendered
  if ($('.alert-container').find('.alert').length === 0) {
    $(alertHtml).prependTo('.alert-container');
  }
}

// set up and show the marker info
function showMarkerInfo(point, marker, index) {
    panelLoader = document.getElementById('tree-info-loader');

    $('#tree_info_div').show('slide', 'swing', 600);
    if (treeInfoDivShowing == false) {
        treeInfoDivShowing = true;
        $('#map-canvas').animate({
            margin: '0 0 0 354px'
        }, 700, function () {
            //Animation Complete
        });;
    }

    //toggle tree mark
    selectedOldTreeMarker = selectedTreeMarker;
    selectedTreeMarker = marker;
    changeTreeMarkSelected();

    // always center this one
    map.panTo(marker.getPosition());

    $("#create-data").html(moment(point["time_created"]).format('MM/DD/YYYY hh:mm A'));
    $("#updated-data").html(point["time_updated"]);
    $("#gps-accuracy-data").html(point["gps_accuracy"]);
    $("#latitude-data").html(point["lat"]);
    $("#longitude-data").html(point["lon"]);
    if (point["missing"]) {
        $("#missing-data").html(YES);
    }
    else {
        $("#missing-data").html(NO);
    }
    if (point["dead"]) {
        $("#dead-data").html(YES);
    }
    else {
        $("#dead-data").html(NO);
    }
    $("#tree-image").attr("src", point["image_url"]);
    $("#tree-id").html(point["id"]);
    $("#planter_name").html(point["first_name"] + ' ' + point["last_name"].slice(0, 1));
    if (point["user_image_url"]) {
        $("#planter_image").attr("src", point["user_image_url"]);
    } else {
        $("#planter_image").attr("src", "img/LogoOnly_Bright_Green100x100.png");
    }
    $("#tree_next").val(getCircularPointIndex(index + 1))
    $("#tree_prev").val(getCircularPointIndex(index - 1))

    $("#tree_next").off('click').on('click', function () {
        fetchMarkers = false;
        var index = parseInt($(this).val(), 10)
        panelLoader.classList.add('active');
        showMarkerInfoByIndex(index)
        $("#tree-image").on('load', function() {
          panelLoader.classList.remove('active');
        })
    });

    $("#tree_prev").off('click').on('click', function () {
        fetchMarkers = false;
        var index = parseInt($(this).val(), 10)
        panelLoader.classList.add('active');
        showMarkerInfoByIndex(index)
        $("#tree-image").on('load', function() {
          panelLoader.classList.remove('active');
        })
    });
}

function changeTreeMarkSelected() {

    if (selectedOldTreeMarker){
        selectedOldTreeMarker.setIcon('./img/pin_29px.png');
        selectedOldTreeMarker.setZIndex(0);
    }

    if (selectedTreeMarker) {
        selectedTreeMarker.setIcon('./img/pin_highlighted.svg');
        selectedTreeMarker.setZIndex(google.maps.Marker.MAX_ZINDEX);
    }
}

// using an index, get the point and marker and show them
function showMarkerInfoByIndex(index) {
    var point = points[index];
    var marker = markerByPointId[point["id"]];
    showMarkerInfo(point, marker, index);
}

// handle the index for a circular list
function getCircularPointIndex(index) {
    if (index > points.length - 1) {
        index = 0;
    }
    else if (index < 0) {
        index = points.length - 1;
    }
    return index;
}

// clear the markers from the map and then clear our the array of markers
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
    var east = bounds.getNorthEast().lng();
    var west = bounds.getSouthWest().lng();
    var north = bounds.getNorthEast().lat();
    var south = bounds.getSouthWest().lat();
    return [east, north, west, south].join();
}

function determineInitialSize(latLng) {
    if (firstRender) {
        initialBounds.extend(latLng);
    }
}

function getClusterRadius(zoom) {
    switch (zoom) {
        case 1:
            return 10;
        case 2:
            return 8;
        case 3:
            return 6;
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

function shortenLargeNumber(number) {
    var units = ['K', 'M'],
        decimal;

    for (var i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);

        if (number <= -decimal || number >= decimal) {
            return +(number / decimal).toFixed(0) + units[i];
        }
    }
    return number;
}

//Initialize Google Maps and Marker Clusterer
var initialize = function () {
    token = getQueryStringValue('token') || null;
    organization = getQueryStringValue('organization') || null;
    treeid = getQueryStringValue('treeid') || null;
    userid = getQueryStringValue('userid') || null;
    flavor = getQueryStringValue('flavor') || null;
    donor = getQueryStringValue('donor') || null;
    loader = document.getElementById('map-loader');

    var initialZoom = 2;
    var minZoom = 2;

    var linkZoom = parseInt(getQueryStringValue('zoom'));
    if (linkZoom) {
        initialZoom = linkZoom;
    }

    if (token != null || organization != null || treeid != null || userid !== null || donor != null) {
        initialZoom = 10;
        minZoom = null;    // use the minimum zoom from the current map type
    }

    var mapOptions = {
        zoom: initialZoom,
        minZoom: minZoom,
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    }

    console.log(mapOptions);

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // only fetch when the user has made some sort of action
    google.maps.event.addListener(map, "dragstart", function () {
        fetchMarkers = true;
        firstInteraction = true;
    });

    function registerFirstInteraction() {
        firstInteraction = true;
    }

    google.maps.event.addListener(map, "click", registerFirstInteraction);

    google.maps.event.addListener(map, "mousemove", registerFirstInteraction);

    google.maps.event.addListener(map, "zoom_changed", function () {
        fetchMarkers = true;
    });

    google.maps.event.addListener(map, "idle", function() {
        var zoomLevel = !firstInteraction ? initialZoom : map.getZoom();
        console.log('New zoom level: ' + zoomLevel);
        currentZoom = zoomLevel;
        initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), zoomLevel);
    });

    // Adjust map bounds after it’s fully loaded, but only before first interaction
    google.maps.event.addListener(map, 'tilesloaded', function() {
      if (!firstInteraction &&
        (token != null || organization != null || treeid != null || userid !== null || donor != null)) {
        map.fitBounds(initialBounds);
      }
    });

    currentZoom = initialZoom;
    //map.setCenter({ lat: -3.33313276473463, lng: 37.142856230615735 });
    map.setCenter({ lat: 20, lng: 0 });

    $('#close-button').click(function () {
        $("#tree_info_div").hide("slide", "swing", 600);
        treeInfoDivShowing = false;
        $('#map-canvas').css('margin-left', '0px');
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
