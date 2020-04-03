var DAR_ES_SAALAM_BOUNDS = {
        south: -7.076662133793353,
        west: 38.82617710304551,
        north: -6.53258085734252,
        east: 39.81494663429551
      };

var mapOptions = {
        zoom: 11,
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: {
            latLngBounds: DAR_ES_SAALAM_BOUNDS,
            strictBounds: true
          },
        minZoom: 11
 	  };