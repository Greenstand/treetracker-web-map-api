import React from 'react';

function App() {

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
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
    };
  }, []);

  return (
    <div>
      next web map
      <div className="map" id="map-canvas" />
    </div>
  );
}

export default App;
