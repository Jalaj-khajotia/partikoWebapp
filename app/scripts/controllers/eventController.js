'use strict';

angular.module('sbAdminApp')
  .controller('EventCtrl', ['$scope', '$window', '$http', 'EventsService',
    function($scope, $window, $http, EventsService) {
      $scope.eventsList= {};
      var callback = function(response)
      {
      
      }
     EventsService.GetEvents(callback)
     .then(function(response){
      console.log(response.data.events);

        $scope.eventsList = response.data.events;
     })
     console.log($scope.eventsList.length);
     $scope.bikename = "jalaj";
     //$scope.eventsList = JSON.parse('{"modules": { "module1": { "title": "name of module1","description": "description of module1",            "weeks": {"week1": {"title": "Week 01"}},"module2": {"title": "name of module2", "description": "description of module2",
               // "weeks": { "week2": {"title": "Week 02"},"week3": { "title": "Week 03" } } } } }}')
     
    
}]);