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

    // take out of function?
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

    fillDates();

    google.maps.event.addListener(map, 'click', function (event) {
      placeMarker(event.latLng, map);
      $('#location').val(event.latLng);

      apiURL = 'https://api.darksky.net/forecast/71488576b366d3016856ce988de83f70/' + event.latLng.lat() + ',' + event.latLng.lng();
      console.log(apiURL);
      /*$.ajax({ // weather API call
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
        });*/

    });

    $('#submit').click(function (e) {
      e.preventDefault(); // prevent map from reloading
      var distance = $('#distance').val();
      var location = $('#location').val();
      console.log(location);
      console.log(distance);
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

var parseWeather = function(data) {
  var summary = data.daily.summary;
  $('#summary').text(summary);
  var day1 = ["High: " + data.daily.data[0]['temperatureMax'], "Low: " + data.daily.data[0]['temperatureMin']];
  $('#day1').empty();
  $('#day1').text(day1);
};

var fillDates = function() {
  var date = new Date();

  $('#day1date').text(date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day2date').text(date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day3date').text(date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day4date').text(date.getMonth() + '/' + date.getDate());
  date.setDate(date.getDate() + 1);
  $('#day5date').text(date.getMonth() + '/' + date.getDate());

};