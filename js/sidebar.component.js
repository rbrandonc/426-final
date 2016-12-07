// Register `phoneList` component, along with its associated controller and template
angular.
module('sidebarApp').
component('sidebar', {
  template: '<form>' +
    '<h1>Find a Destination!</h1>' +
    '<text>within </text>' +
    '<input type="number" name="distance" value="0" style="width: 50px" id="distance"/>' +
    '<text> miles</text><br/>' +
    '<text>of </text>' +
    '<input type="text" name="location" value="" id="location"/><br/>' +
    '<input type="submit" value="Go!" id="submit"/>' +
    '</form>',
  controller: function SidebarController() {
    console.log('hi');
  }
});

/*// Define the `sidebarComponent` module
var sidebarComponent = angular.module('sidebarComponent', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
sidebarComponent.controller('SidebarController', function SidebarController($scope) {
  $scope.places = [
    {
      name: 'Chapel Hill',
      snippet: 'Why would you want to go here?'
    }, {
      name: 'Italy',
      snippet: 'Eat pizza'
    }, {
      name: 'New York City',
      snippet: 'Eat inferior pizza'
    }
  ];
});*/