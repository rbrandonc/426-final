function initMap() {
  var myLatLng = {
    lat: -25.363,
    lng: 131.044
  };

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('top'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 10
  });

  //if(navigator.location){
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    //infoWindow.setPosition(pos);
    //infoWindow.setContent('Location found.');
    map.setCenter(pos);

    // Create a marker and set its position.
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

    google.maps.event.addListener(map, 'click', function (event) {
      placeMarker(event.latLng, map);
      console.log(event.latLng);
      $('#location').val(event.latLng);

      $.ajax({
          url: 'https://api.darksky.net/forecast/71488576b366d3016856ce988de83f70/37.8267,-122.4233',
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

    /*map.addListener('center_changed', function () {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      window.setTimeout(function () {
        map.panTo(marker.getPosition());
      }, 3000);
    });

    marker.addListener('click', function () {
      map.setZoom(8);
      map.setCenter(marker.getPosition());
    });*/

    // }
    // else{
    //   console.log("no location");
    // }
  });
}

//$(document).ready(function(e) {
//});

$('#submit').click(function () {
  var location = $('#location').val();
  var distance = $('#distance').val();
  console.log(location);
  console.log(distance);
});

var parseWeather = function(data) {
  var summary = data.daily.summary;
  $('#summary').text(summary);
  var day1 = ["High: " + data.daily.data[0]['temperatureMax'], "Low: " + data.daily.data[0]['temperatureMin']];
  $('#day1').empty();
  $('#day1').text(day1);
};