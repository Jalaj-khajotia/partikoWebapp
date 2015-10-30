'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', ['$scope', '$window', 'EventsService', 'AuthenticationService','$rootScope',
    function($scope, $window, EventsService, AuthenticationService, $rootScope ) {
      var token = sessionStorage["token"],
        pastEvents = [],
        epoch,
        latestEvents = [],
        today,
        isEventsPresentinSession,
        LoadedEvents;

    /*  $scope.filteredEvents = [{
        "name": "jalaj",
        "start_time": "02/08/2015",
        "cover": ""
      }, {
        "name": "jalaj",
        "start_time": "02/08/2015",
        "cover": ""
      }];*/

      if (!token) {
        // $window.location.href ="/#/Login";
      } else {}

       function CheckLastSession() {
        var LastEventFetchedDate = sessionStorage.getItem('eventsFetchedDate');
        LoadedEvents = sessionStorage.getItem('allEvents');
        var TodaysDate = today.today();
        if (LoadedEvents !== 'undefined' && LoadedEvents != null && LoadedEvents != '' &&
          TodaysDate === LastEventFetchedDate) {
          isEventsPresentinSession = true;
        } else {
          isEventsPresentinSession = false;
        }        
      }

      function LoadDateTimeFunction() {
        Date.prototype.today = function() {
          return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
        }
        Date.prototype.timeNow = function() {
          return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }
      }

      function LoadEventsFromSession() {
        $scope.eventsList = JSON.parse(LoadedEvents);
      }

      function ProcessEvents(Type) {       
        epoch = moment(today.today() + " " + today.timeNow(), "D/M/YYYY H:mm").unix();

        angular.forEach($scope.eventsList, function(event) {
          if (Type === 'past') {
            console.log("evluating past");
            $scope.Heading = "All Past Events: before " + today.today() + " " + today.timeNow();
            if (parseInt(event.start_time) < epoch) {
              var GMTTime = moment.unix(event.start_time);
              event.start_time = moment(GMTTime).subtract({
                'hours': '5',
                'minutes': '30'
              }).format('ll HH:mm');
              pastEvents.push(event);
            }
          } else {
            console.log("evluating latest");
            $scope.Heading = "All Latest Events: after " + today.today() + " " + today.timeNow();
            if (parseInt(event.start_time) >= epoch) {
              var GMTTime = moment.unix(event.start_time).format('ll HH:mm');
              event.start_time = moment(GMTTime).subtract({
                'hours': '5',
                'minutes': '30'
              }).format('ll HH:mm');
              latestEvents.push(event);
            }
          }
        });
      }

       function LoadEventfromEventService() {
        EventsService.GetEvents(function() {})
          .then(function(response) {
            $scope.eventsList = response.data.events;
            sessionStorage.setItem('allEvents', JSON.stringify(response.data.events));
            sessionStorage.setItem('eventsFetchedDate', today.today());
            ProcessEvents('past');
            ProcessEvents('latest');
            DisplayEvents();
          });
      }

      function DisplayEvents() {
        $scope.pastEvents = pastEvents;
        $scope.latestEvents = latestEvents;
      }

      function LoadEvents() {
        CheckLastSession();   

        if (isEventsPresentinSession) {
          LoadEventsFromSession();
          ProcessEvents('past');
          ProcessEvents('latest');
        } else {
          LoadEventfromEventService();
        }

      };

      function LoadMerchantProfile(){
        AuthenticationService.GetProfile().then(function(response){
          $rootScope.name = response.data.data.name;
          console.log($rootScope.name);
          $scope.profile = response.data;
        },function(){

        })
      }

      function _initilize() {
        AuthenticationService.CheckForLoggedin();
         today = new Date();
        LoadDateTimeFunction();
        LoadMerchantProfile();
        LoadEvents();
        DisplayEvents();
      }
      _initilize();
      $scope.LogOut = function() {
        console.log("i am getting called");
      }

    }
  ]);