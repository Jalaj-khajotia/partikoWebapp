'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap.datetimepicker'], ['flow'])
  /*.config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
      target: 'upload.php',
      permanentErrors: [404, 500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 4,
      singleFile: true
    };
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
    // flowFactoryProvider.factory = fustyFlowFactory;
  }])*/
  .controller('addEventCtrl', ['$scope', '$timeout', '$http', 'EventsService', function($scope, $timeout, $http, EventsService) {

    //http://jsonplaceholder.typicode.com/posts/1



    var event = '{"name":"test1", "category":"Music", "start_time":"2015-10-22T10:00:00",  "description": "new event jalaj", "tags": "comedy", "phone2": "8179014226", "price": "1", "phone1": "9717152069", "cover": "" }';

    //console.log(EventsService.GetEvents(event));

    $scope.AddEvent = function(newEvent) {
      newEvent.start_time = "2015-10-28T10:00:00";
      EventsService.AddEvents(newEvent, function() {
          alert("event added successfully")
        },
        function() {
          alert("error occurred");
        });
    };
  }]);