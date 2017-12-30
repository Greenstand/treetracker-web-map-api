<!DOCTYPE html>
<html>
<head>
    <style type="text/css">
        html, body, #map-canvas { height: 100%; margin: 0; padding: 0;}
    </style>
    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLHZL7-3Y5aNMlW_Cz5G1NyBn5R0Mmurs">
    </script>
    {{ HTML::script('js/jquery-2.1.3.min.js');}}
    {{ HTML::script('js/markerclusterer.js') }}
    <script type="text/javascript">
        var map = undefined;//Google Map object
        var mc = undefined;//Marker Clusterer
        var markers = [];//All the markers
        var markerBounds = new google.maps.LatLngBounds();//Marker bounds

        //Get the tree data and create markers with corresponding data
        var initMarkers = function() {
            @foreach($trees as $tree)
            var latLng = new google.maps.LatLng({{$tree->primaryLocation->lat}}, {{$tree->primaryLocation->lon}});
            var infowindow = new google.maps.InfoWindow({
                content:'{{HTML::image("/img/loading.gif");}}'
            });
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title:"Tree"
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, this);

                $.ajax({
                    url: "/showtreedata/{{{$tree->id}}}",
                    cache: false
                })
                    .done(function( html ) {
                        infowindow.setContent(html);
                        $(".carousel-control").css("background-image", "none");
                    });


            });

            markerBounds.extend(latLng);
            markers.push(marker);

            @endforeach
        }

        //Initialize Google Maps and Marker Clusterer
        var initialize = function() {
            var mapOptions = {
              zoom: 4,
              mapTypeId: 'hybrid'
            }
            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            initMarkers();

            var mcOptions = {gridSize: 50, maxZoom: 13};
            mc = new MarkerClusterer(map, markers, mcOptions);

            map.setCenter({lat: -3.263960, lng: 36.624882});
            map.setZoom(15);

            //map.fitBounds(markerBounds);
        }

        google.maps.event.addDomListener(window, 'load', initialize);
    </script>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

    <style>

        .carousel-inner > .item > img {
            margin: 0 auto;
            max-height: 250px;
        }


    </style>
</head>
<body>
<div id="map-canvas"></div>
</body>
</html>
