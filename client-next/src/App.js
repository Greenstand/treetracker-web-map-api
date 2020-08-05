import React from 'react';
import expect from "./expect";

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

const dataString = '{"data":[{"type":"cluster","id":6633370,"centroid":{"type":"Point","coordinates":[17.7059301432998,-0.750389389527574]},"region_type":21,"count":"49188"},{"type":"cluster","id":6633372,"centroid":{"type":"Point","coordinates":[134.005130433686,-26.6329991384479]},"region_type":21,"count":"45090"},{"type":"cluster","id":6633373,"centroid":{"type":"Point","coordinates":[25.1307668733496,55.5547728137252]},"region_type":21,"count":"1854"},{"type":"cluster","id":6633376,"centroid":{"type":"Point","coordinates":[-61.6849922603446,-18.4239591218155]},"region_type":21,"count":"1"},{"type":"cluster","id":6633381,"centroid":{"type":"Point","coordinates":[112.439997397747,37.538520197145]},"region_type":21,"count":"1613"},{"type":"cluster","id":6633382,"centroid":{"type":"Point","coordinates":[116.179439054975,63.2551984352121]},"region_type":21,"count":"391"},{"type":"cluster","id":6633383,"centroid":{"type":"Point","coordinates":[55.2021830908262,36.8891032742158]},"region_type":21,"count":"2154"},{"type":"cluster","id":6633386,"centroid":{"type":"Point","coordinates":[-100.166444768947,38.9003919231381]},"region_type":21,"count":"42392"}],"zoomTargets":[{"region_id":6633370,"most_populated_subregion_id":6633323,"total":"14459","zoom_level":4,"centroid":{"type":"Point","coordinates":[23.6413186472675,-2.87819918226245]}},{"region_id":6633372,"most_populated_subregion_id":6633327,"total":"45090","zoom_level":4,"centroid":{"type":"Point","coordinates":[135.861287249936,-30.0830623575016]}},{"region_id":6633373,"most_populated_subregion_id":6633356,"total":"1353","zoom_level":4,"centroid":{"type":"Point","coordinates":[25.5752943938719,49.390422739306]}},{"region_id":6633376,"most_populated_subregion_id":6633156,"total":"1","zoom_level":4,"centroid":{"type":"Point","coordinates":[-65.1428660145168,-35.5033113327271]}},{"region_id":6633381,"most_populated_subregion_id":6633329,"total":"1112","zoom_level":4,"centroid":{"type":"Point","coordinates":[103.819073145824,36.5617653792527]}},{"region_id":6633382,"most_populated_subregion_id":6633144,"total":"892","zoom_level":4,"centroid":{"type":"Point","coordinates":[96.3271098688591,61.9564537229541]}},{"region_id":6633383,"most_populated_subregion_id":6633291,"total":"651","zoom_level":4,"centroid":{"type":"Point","coordinates":[54.2693195362499,32.583397353079]}},{"region_id":6633386,"most_populated_subregion_id":6633365,"total":"42392","zoom_level":4,"centroid":{"type":"Point","coordinates":[-114.148167209111,42.1252695324697]}}]}';

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
        mapTypeControl: false,
        center: { lat: 20, lng: 0},
        zoom: 2,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeId: "hybrid",
      });

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
          label: {
            text: shortenLargeNumber(d.count).toString(),
          },

        });
      });
    };
  }, []);

  return (
    <div>
      <div className="map" id="map-canvas" />
    </div>
  );
}

export default App;
