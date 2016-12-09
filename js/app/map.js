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
    center: {
      lat: 40.674,
      lng: -73.945
    },
    zoom: 8,
    disableDefaultUI: true,
    styles: [{
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{
        "saturation": 36
      }, {
        "color": "#c6c6c6"
      }, {
        "lightness": 40
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#000000"
      }, {
        "lightness": 16
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 17
      }, {
        "weight": 1.2
      }]
    }, {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{
        "lightness": 20
      }, {
        "color": "#2c2c2c"
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "color": "#0b0b0b"
      }, {
        "lightness": 21
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#7d7d7d"
      }, {
        "lightness": 17
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#999696"
      }, {
        "lightness": 29
      }, {
        "weight": 0.2
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{
        "color": "#3e3d3d"
      }, {
        "lightness": 18
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{
        "color": "#242424"
      }, {
        "lightness": 16
      }]
    }, {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{
        "color": "#8f8f8f"
      }, {
        "lightness": 19
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#7bafd4"
      }, {
        "lightness": 17
      }]
    }]
  });
  var geocoder = new google.maps.Geocoder();
  var placesService = new google.maps.places.PlacesService(map);

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
  var currentLatLng;
  var marker;

  function placeMarker(pos, map) {
    if (marker) {
      marker.setPosition(pos);
      window.setTimeout(function () {
        map.panTo(marker.getPosition());
      }, 500);
    } else {
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Vacation destination'
      });
    }
  }

  /*
  Move marker to where user clicks and make weather API call.
  */
  google.maps.event.addListener(map, 'click', function (event) {
    currentLatLng = event.latLng;
    placeMarker(currentLatLng, map);
    lookupLocationName(geocoder, currentLatLng);

    apiURL = 'https://api.darksky.net/forecast/71488576b366d3016856ce988de83f70/' + currentLatLng.lat() + ',' + currentLatLng.lng();
    $.ajax({ // weather API call
        url: apiURL,
        dataType: 'jsonp' // TODO: if I ever feel like being a good programmer, change to CORS request
      })
      .done(function (data) {
        placeMarker({
          lat: currentLatLng.lat(),
          lng: currentLatLng.lng()
        }, map);
        parseWeather(data);
      })
      .fail(function (xhr, textStatus, error) {
        console.log(xhr.responseText);
      });
  });

  map.addListener(map, 'dragend', function (event) {
    map.setCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  });

  /*
  Zoom in map if marker is clicked on. 
  */
  if (marker) {
    marker.addListener('click', function () {
      map.setZoom(9);
      map.setCenter(marker.getPosition());
    });
  }

  /*
  When 'go' button is clicked
  Add a new database entry in MongoDB according to database schema
  */
  var nearbyLocation;
  $('#submit').click(function (e) {
    e.preventDefault(); // prevent map from reloading

    /*var place = geocoder.geocode($("#location").val());
    if (place) {
      var result = place.results[1];
      var latlng = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      };
    }*/

    findNearbyLocation(placesService, currentLatLng, function (chosenNearbyLocation) {
      if (chosenNearbyLocation) {
        nearbyLocation = chosenNearbyLocation;
      } else {
        console.log('failed');
      }
      $('#destination').removeClass('hidden');
      $('#nearbyLocation').html('&nbsp;&nbsp;&nbsp;' + nearbyLocation.vicinity + '&nbsp;&nbsp;&nbsp;');

      apiURL = 'https://api.darksky.net/forecast/71488576b366d3016856ce988de83f70/' + nearbyLocation.geometry.location.lat() + ',' + nearbyLocation.geometry.location.lng();
      $.ajax({ // weather API call
          url: apiURL,
          dataType: 'jsonp' // TODO: if I ever feel like being a good programmer, change to CORS request
        })
        .done(function (data) {
          placeMarker({
            lat: nearbyLocation.geometry.location.lat(),
            lng: nearbyLocation.geometry.location.lng()
          }, map);
          parseWeather(data);
          postDestination(nearbyLocation.geometry.location.lat(), nearbyLocation.geometry.location.lng(), nearbyLocation.vicinity);
        })
        .fail(function (xhr, textStatus, error) {
          console.log(xhr.responseText);
        });
    });
  });

  /*
  Build JSON string to add location to database and send POST request to add to database.
  */
  function postDestination(lat, lng, destination) {
    var jsonData = {};

    var date = new Date();
    jsonData.dateCreated = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    jsonData.startingLatitude = currentLatLng.lat();
    jsonData.startingLongitude = currentLatLng.lng();
    jsonData.startingLocationName = $('#location').val();
    jsonData.distance = $('#distance').val();
    jsonData.nearbyLocationLatitude = lat;
    jsonData.nearbyLocationLongitude = lng;
    jsonData.nearbyLocationName = destination;
    var days = ["day0", "day1", "day2", "day3", "day4"];
    for (var i = 0; i < 5; i++) {
      days[i] = {
        "date": $('#day' + i + 'date').text(),
        "weather": $('#day' + i + ' .forecast').text(),
        "high": $('#day' + i + ' .temp').text().split("/")[0],
        "low": $('#day' + i + ' .temp').text().split("/")[1]
      };
      jsonData['day' + i] = days[i];
    }
    console.log(jsonData);

    $.ajax({
        type: 'POST',
        url: 'https://localhost:1337/api/destination',
        data: jsonData,
        dataType: 'json'
      })
      .done(function (data) {
        console.log('Destination added to database.');
        loadPlaces();
        // console.log(data);
      })
      .fail(function (xhr, textStatus, error) {
        console.log(xhr.responseText);
      });
  }

}

/*
Get name of location from coordinates and put it in destination text box.
*/
function lookupLocationName(geocoder, location) {
  var latLng = {
    lat: location.lat(),
    lng: location.lng()
  };
  geocoder.geocode({
    'location': latLng
  }, function (results, status) {
    if (status === 'OK') {
      if (results[1]) {
        $('#location').val(results[1].formatted_address);
      }
    } else {
      $('#location').val(location); // just fill with latitude/longitude coordinates
    }
  });
}

/*
Find nearby location when user clicks 'go'
*/
var findNearbyLocation = function (placesService, coordinates, callbackFn) {
  distance = $('#distance').val() * 1609.344; // convert to meters
  var request = {
    location: {
      lat: coordinates.lat(),
      lng: coordinates.lng()
    },
    radius: distance, // sadly, max allowed radius is 50,000 meters which is ~30 miles
  };
  // var chosenNearbyLocation;
  placesService.nearbySearch(request, function (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      callbackFn(results[results.length - 1]);
    } else {
      callbackFn(null);
    }
  });
};

/*
Parse weather JSON from Dark Sky API call
*/
var parseWeather = function (data) {
  //var summary = data.daily.summary;
  //$('#summary').text(summary);

  for (var i = 0; i < 5; i++) { // fill weather
    var temp = Math.round(data.daily.data[i].temperatureMin) + "°/" + Math.round(data.daily.data[i].temperatureMax) + "°";
    var forecast = data.daily.data[i].summary;

    $('#day' + i + ' .temp').empty();
    $('#day' + i + ' .temp').text(temp);
    $('#day' + i + ' .forecast').empty();
    $('#day' + i + ' .forecast').text(forecast);
    $('#day' + i + 'icon').html("<img src=" + "/images/Weather/" + data.daily.data[i].icon + ".png" + " alt=" + " weathericon" + "height = " + "50" + " width= " + " 50" + ">");
  }
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

  for (var i = 0; i < 5; i++) {
    $('#day' + i + 'date').text(days[date.getDay()] + " " + (date.getMonth() + 1) + '/' + date.getDate());
    date.setDate(date.getDate() + 1);
  }
};

/*
Switches tabs in index.pug
*/
function openTab(event, tabName) {
  var i, tabcontent, tablinks;
  if (tabName === 'weather') {
    $('#places').removeClass('active');
    $('#places').css('display', 'none');
    $('#weather').css('display', 'block');
    $('#weather').addClass('active');
  } else if (tabName === 'places') {
    $('#weather').removeClass('active');
    $('#weather').css('display', 'none');
    $('#places').css('display', 'block');
    $('#places').addClass('active');
    loadPlaces();
  }
}

var places;

function loadPlaces() {
  var placesTable = $('#placesBody');
  $.ajax({
      type: 'GET',
      url: 'https://localhost:1337/api/destinations',
      dataType: 'json'
    })
    .done(function (data) {
      places = data;
      placesTable.empty();
      var tr = $('<tr>');
      for (var i = 0; i < places.length; i++) {
        if ((i !== 0 && i % 6 === 0) || i === places.length - 1) {
          $('<td>' + places[i].nearbyLocationName + '<input type="button" style="float: right;" class="removeButton" value="x" id="' + places[i].nearbyLocationName + '"/>' + '</td>').appendTo(tr);
          tr.appendTo(placesTable);
          tr = $('<tr>');
        } else {
          $('<td>' + places[i].nearbyLocationName + '<input type="button" style="float: right;" class="removeButton" value="x" id="' + places[i].nearbyLocationName + '"/>' + '</td>').appendTo(tr);
        }
      }
    })
    .fail(function (xhr, textStatus, error) {
      placesTable.text("You don't have any destinations saved.");
      console.log(xhr.responseText);
    });
}

$(document).ready(function () {
  document.getElementById('weatherTab').click();
  loadPlaces();
});

$('#placesBody').click(function (event) {
  var target = event.target.innerHTML.split('<')[0];
  var result;
  if (target.length > 0) { // must have clicked on destination
    result = $.grep(places, function (e) {
      return e.nearbyLocationName == target;
    });
    if (result.length === 0) {
      // not found
    } else {
      restoreDestination(result[0]);
    }
  } else { // must have clicked delete button
    result = $.grep(places, function (e) {
      return e.nearbyLocationName == event.target.id;
    });
    if (result.length === 0) {
      // not found
    } else {
      var id = result[0]._id;
      removeDestination(id);
    }
  }
});

function removeDestination(locationID) {
  $.ajax({
      type: 'DELETE',
      url: 'https://localhost:1337/api/destination/' + locationID,
    })
    .done(function () {
      console.log('Destination deleted');
      loadPlaces();
    })
    .fail(function (xhr, textStatus, error) {
      console.log(xhr.responseText);
    });
}

function restoreDestination(destination) {
  console.log('restoring...');
}