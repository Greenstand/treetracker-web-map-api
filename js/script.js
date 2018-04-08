console.log("Hello");

$(document).ready(function() {
  $('#close-button').click(function() {
    $("#tree_info_div").hide();
  });
  initialize();
});

//Mapbox
const YES = "YES";
const NO = "NO";
var map = undefined;//Mapbox object
var mc = undefined;//Marker Clusterer
var markers = [];//All the markers

//Get the tree data and create markers with corresponding data
var initMarkers = function() {
  var zoomLevel = map.getZoom();
  console.log(zoomLevel);
  $.get( "http://dev.treetracker.org/api/trees?zoom="+zoomLevel, function( data ) {
    console.log('got data');

    clearOverlays(markers);
    $.each(data.data, function(i, item) {

    var gridColorValues = {
        5: "pink",
        10: "lightcoral",
        50: "coral",
        100: "orange",
        1000: "orangered",
        10000: "red"
    }

      if(item.type == 'cluster') {
        centroid = JSON.parse(item.centroid);
        var latLng = [centroid.coordinates[0], centroid.coordinates[1]];

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
        var el = document.createElement('div');
        el.className = 'marker'+pinicon;
        var marker = new mapboxgl.Marker(el).setLngLat(latLng).addTo(map)

        markers.push(marker);

      } else if (item.type == 'point') {

        var latLng = [item.lat, item.lon];
        /*var infowindow = new google.maps.InfoWindow({
          content:'/img/loading.gif'
        });*/

        var marker = new mapboxgl.Marker().setLngLat(latLng).setPopup(popup(item)).addTo(map) 

        markers.push(marker);
      }

    });
  });
}

function popup(item) {
          var currentItem = item;
          //infowindow.open(map, this);
          console.log(currentItem);

          $("#tree_info_div").show();
          $("#create-data").html(currentItem["time_created"]);
          $("#updated-data").html(currentItem["time_updated"]);
          $("#gps-accuracy-data").html(currentItem["gps_accuracy"]);
          $("#latitude-data").html(currentItem["lat"]);
          $("#longitude-data").html(currentItem["lon"]);
          if(currentItem["missing"]){
            $("#missing-data").html(YES);
          }
          else {
            $("#missing-data").html(NO);
          }
          if(currentItem["dead"]){
            $("#dead-data").html(YES);
          }
          else{
            $("#dead-data").html(NO);
          }
}

function clearOverlays(overlays) {
  console.log(overlays);
  for (var i = 0; i < overlays.length; i++ ) {
    //console.log(i);
    overlays[i].remove();
  }
  overlays.length = 0;
}

//Initialize Mapbox and Marker Clusterer
var initialize = function() {
  console.log("ok");
  mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGhld3hpIiwiYSI6ImNqZW9scnl3ZDA3M3oyd202NHZkZHRsM2oifQ.A5X0BI-tzS5c0LAkHLAMwg';
  map = new mapboxgl.Map({
      container: 'map-canvas',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
      center: [36.624882, -3.263960]
  });

  //TODO: Replace 12 with the new mapbox zoom level once we find it out
  map.on('moveend', function () { 
      var zoomLevel = map.getZoom();
      if( (currentZoom < 12 && zoomLevel >= 12)
          || (currentZoom >= 12 && zoomLevel < 12 ) ) {
        console.log('reload');
          initMarkers();
      }
      currentZoom = zoomLevel;
  });
}

