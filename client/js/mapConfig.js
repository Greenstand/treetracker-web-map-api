var DAR_ES_SAALAM_BOUNDS = {
       south: -7.842182,
        west: 38.149433,
        north: -6.113815,
        east: 40.670796
      };

var mapOptions = {
        zoom: 10,
        center: {lat: -6.888822, lng: 39.316731},
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: {
            latLngBounds: DAR_ES_SAALAM_BOUNDS,
            strictBounds: true
          }
 	  };