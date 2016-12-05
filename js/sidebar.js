// Define the `phonecatApp` module
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
});