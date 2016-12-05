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

   google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng, map);
    console.log(event.latLng);
    $('#location').val(event.latLng);
   });

  // }
  // else{
  //   console.log("no location");
  // }
 });
}

 /*$(document).ready(function(e) {
  // console.log('TEST1');
  $('#submit').click(function() {
   var location = $('#location').val();
   var distance = $('#distance').val();
   console.log(location);
   console.log(distance);
  });
 });*/

 $('#submit').click(function () {
  var location = $('#location').val();
  var distance = $('#distance').val();
  console.log(location);
  console.log(distance);
 });