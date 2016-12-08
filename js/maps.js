function initMap() {
  // Setup stuff
  var myLatLng = { // Chapel Hill
    lat: -25.363,
    lng: 131.044
  };
  fillDates();

  // Create a map object and specify the DOM element for display.
  // Styles a map in night mode.
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.674, lng: -73.945},
          zoom: 12,
          disableDefaultUI: true,
          styles: [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#c6c6c6"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0b0b0b"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7d7d7d"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#999696"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3e3d3d"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#242424"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#8f8f8f"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#7bafd4"
            },
            {
                "lightness": 17
            }
        ]
    }
]
        });

  /*
  Set initial location of map
  */
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    //infoWindow.setPosition(pos);
    //infoWindow.setContent('Location found.');
    map.setCenter(pos);

  });

  /* 
  Create single marker and set its position 
  */
  var marker;
  function placeMarker(pos, map) {
    if (marker) {
      marker.setPosition(pos);
    } else {
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Vacation Destination'
      });
    }
  }

  /*
  Move marker to where user clicks.  
  */
  google.maps.event.addListener(map, 'click', function (event) {
    console.log("map clicked");
    placeMarker(event.latLng, map);
    $('#location').val(event.latLng);

    console.log("calling weather API");

    apiURL = 'https://api.darksky.net/forecast/71488576b366d3016856ce988de83f70/' + event.latLng.lat() + ',' + event.latLng.lng();
    console.log(apiURL);
    $.ajax({ // weather API call
        url: apiURL,  
        //crossDomain: true,
        dataType: 'jsonp'
      })
      .done(function (data) {
        console.log(data);
        parseWeather(data);
      })
      .fail(function (xhr, textStatus, error) {
        console.log(failed);
        console.log(xhr.responseText);
      });

    });

  /*
  Zoom in map if marker is clicked on. 
  */
  if (marker) {
    marker.addListener('click', function () {
      map.setZoom(1);
      map.setCenter(marker.getPosition());
    });
  }

  /*
  Change center of map when marker is clicked on.
  */
  map.addListener('center_changed', function () {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function () {
      if (marker) {
        map.panTo(marker.getPosition());
      }
    }, 3000);
  });

  /*
  When submit button is clicked
  */
  $('#submit').click(function (e) {
    e.preventDefault(); // prevent map from reloading
    var distance = $('#distance').val();
    var location = $('#location').val();
    console.log(location);
    console.log(distance);
  });


}

//$(document).ready(function(e) {
//});

/*
Parse weather JSON from Dark Sky API call
And fill in appropriate html
*/
var parseWeather = function (data) {
  var summary = data.daily.summary;
  $('#summary').text(summary);
  var day1 = ["High: " + data.daily.data[0]['temperatureMax'], "Low: " + data.daily.data[0]['temperatureMin']];
  $('#day1').empty();
  $('#day1').text(day1);
};

/*
Fill dates table in index.pug
*/
var fillDates = function () {
  var date = new Date();

  var days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  $('#day1date').text(days[date.getDay()] + " " + date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day2date').text(days[date.getDay()] + " " + date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day3date').text(days[date.getDay()] + " " + date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day4date').text(days[date.getDay()] + " " + date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day5date').text(days[date.getDay()] + " " + date.getMonth() + '/' + date.getDate());

};