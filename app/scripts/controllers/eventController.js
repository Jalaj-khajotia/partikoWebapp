'use strict';

angular.module('sbAdminApp')
  .controller('EventCtrl', ['$scope', '$window', '$http', 'EventsService', '$stateParams',
    function($scope, $window, $http, EventsService, $stateParams) {

      var eventsType = $stateParams.type;
      $scope.eventsList = {};
      $scope.filteredEvents = {};

      $scope.LoadEvents = function(Type) {
        var checkForSavedEvents = sessionStorage.getItem('allEvents');
        if (!!checkForSavedEvents) {
          $scope.eventsList = JSON.parse(checkForSavedEvents);
        } else {
          EventsService.GetEvents(function() {})
            .then(function(response) {
              $scope.eventsList = response.data.events;
              sessionStorage.setItem('allEvents', JSON.stringify(response.data.events));
            });
        }

        // For todays date;
        Date.prototype.today = function() {
          return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
        }

        // For the time now
        Date.prototype.timeNow = function() {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
          }
          /* var todayDate = GetDate();
           console.log(todayDate);
              var today = new Date();  
            console.log("today: "+ today.today() +" timeNow: " + today.timeNow());     
           console.log("time: "+ today.today()+" "+ today.timeNow());
            console.log("epoch: "+ epoch);*/

        var today = new Date();
        var epoch = moment(today.today() + " " + today.timeNow(), "D/M/YYYY H:mm").unix();
        var pastEvents = [];
        var latestEvents = [];

        console.log("Type =" + Type);
        angular.forEach($scope.eventsList, function(event) {

          if (Type === 'past') {
            console.log("evluating past");
            if (parseInt(event.start_time) < epoch) {
              pastEvents.push(event);
            }
          } else {
            console.log("evluating latest");
            if (parseInt(event.start_time) >= epoch) {
              latestEvents.push(event);
            }
          }
        });
        if (Type === 'past') {
          $scope.filteredEvents = pastEvents;
        } else {
          $scope.filteredEvents = latestEvents;
        }

        /*   console.log(pastEvents);  
           console.log(latestEvents);*/


        //need to make sessionStorage.clear
        //  console.log($scope.eventsList.length);
      }

      $scope.LoadEvents(eventsType);

      $scope.DeleteEvent = function(event) {
        console.log('deleting event' + event);
        EventsService.DeleteEvent(event.key).then(function(response) {
          console.log(response);
        });

      }

      $scope.ShowEventDetails = function(event) {
          // console.log(event);
          var stringevent = JSON.stringify(event);
          sessionStorage.setItem('currentEvent', stringevent);
          $window.location.href = '/#/dashboard/event';
        }
        //$scope.eventsList = JSON.parse('{"modules": { "module1": { "title": "name of module1","description": "description of module1",            "weeks": {"week1": {"title": "Week 01"}},"module2": {"title": "name of module2", "description": "description of module2",
        // "weeks": { "week2": {"title": "Week 02"},"week3": { "title": "Week 03" } } } } }}')


    }
  ]);