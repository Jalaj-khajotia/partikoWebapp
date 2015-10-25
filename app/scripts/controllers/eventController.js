'use strict';

angular.module('sbAdminApp', ['toastr'])
  .controller('EventCtrl', ['$scope', '$window', '$http', 'EventsService', '$stateParams', 'toastr',
    function($scope, $window, $http, EventsService, $stateParams, toastr) {

      var eventsType = $stateParams.type;
      var keyword = $stateParams.search;
      var pastEvents = [];
      var latestEvents = [];
      $scope.eventsList = {};
      $scope.filteredEvents = {};
      var epoch, isEventsPresentinSession;
     $scope.hideSearchBar = true;
      function LoadEventsFromSession() {
        $scope.eventsList = JSON.parse(isEventsPresentinSession);
      }

      function CheckLastSession() {
        isEventsPresentinSession = sessionStorage.getItem('allEvents');
      }


      function LoadEvents(Type) {
        CheckLastSession();
        Date.prototype.today = function() {
            return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
          }
          // For the time now
        Date.prototype.timeNow = function() {
          return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }

        function ProcessEvents() {
          var today = new Date();
          epoch = moment(today.today() + " " + today.timeNow(), "D/M/YYYY H:mm").unix();
          angular.forEach($scope.eventsList, function(event) {
            if (Type === 'past') {
              console.log("evluating past");
              $scope.Heading = "All Past Events: before " + today.today() + " " + today.timeNow();
              if (parseInt(event.start_time) < epoch) {
                event.start_time = moment.unix(event.start_time).format('ll HH:mm');
                pastEvents.push(event);
              }
            } else {
              console.log("evluating latest");
              $scope.Heading = "All Latest Events: after " + today.today() + " " + today.timeNow();
              if (parseInt(event.start_time) >= epoch) {
                event.start_time = moment.unix(event.start_time).format('ll HH:mm');
                latestEvents.push(event);
              }
            }
          });
        }
        if (isEventsPresentinSession !== undefined && isEventsPresentinSession != null && isEventsPresentinSession != '') {
          LoadEventsFromSession();
          ProcessEvents();
        } else {
          EventsService.GetEvents(function() {})
            .then(function(response) {
              $scope.eventsList = response.data.events;
              sessionStorage.setItem('allEvents', JSON.stringify(response.data.events));
              ProcessEvents();
              ProcessEvents();

            });
        }
        // For todays date;

        console.log("Type =" + Type);
        if (Type === 'past') {
          $scope.filteredEvents = pastEvents;

        } else {
          $scope.filteredEvents = latestEvents;

        }

        /*   console.log(pastEvents);  
           console.log(latestEvents);*/


        //need to make sessionStorage.clear
        //  console.log($scope.eventsList.length);
      };

      if (eventsType !== "" && eventsType !== null && eventsType !== undefined) {
        LoadEvents(eventsType);
      }


      $scope.SearchEvent = function(keyword) {
        $scope.hideSearchBar = false;
        var pastEvents = [];
        var latestEvents = [];
        CheckLastSession();
        if (isEventsPresentinSession !== "undefined" && isEventsPresentinSession != null && isEventsPresentinSession != '') {
          LoadEventsFromSession();
        }
        angular.forEach($scope.eventsList, function(event) {
          if (event.name.toLowerCase().indexOf(keyword) != -1) {
            if (parseInt(event.start_time) < epoch) {
              pastEvents.push(event);
            } else {
              latestEvents.push(event);
            }
          }
        });
        console.log(pastEvents);
        console.log(latestEvents);
        $scope.filteredEvents = null;
        if (pastEvents.length > 0) {
          latestEvents.push(pastEvents);
        }
        //$scope.filteredEvents.push(latestEvents); 
        debugger;
        $scope.filteredEvents = latestEvents;
        console.log("result of search");
        console.log($scope.filteredEvents);

      }
      if (keyword !== "" && keyword !== null && keyword !== undefined) {
        $scope.SearchEvent(keyword.toLowerCase());
      } else {
        if (eventsType === 'past') {
          $window.location.href = '/#/dashboard/events?type=past';
        } else {
          $window.location.href = '/#/dashboard/events?type=latest';
        }
      }

      $scope.DeleteEvent = function(event) {
        console.log('deleting event' + event.key+ '  '+event.name);
        EventsService.DeleteEvent(event.key).then(function(response) {
          toastr.success('Event deleted successfully', 'Success!');
          sessionStorage.removeItem('allEvents');
          var afterDeleteEvents = [];
          angular.forEach($scope.filteredEvents, function(currentEvent) {
            if (currentEvent.key !== event.key && currentEvent.key !== undefined && currentEvent.key !== null && currentEvent.key !== '') {
              afterDeleteEvents.push(currentEvent);
            }
          });

          $scope.filteredEvents = afterDeleteEvents;
         // var eventString =  JSON.stringify(afterDeleteEvents);
          //sessionStorage.setItem('allEvents', eventString);
          console.log($scope.filteredEvents);
          console.log('event getting deleted');
          console.log(afterDeleteEvents);
        }, function() {
          toastr.success('Event deleting failed', 'Error!');
        });
      }

      $scope.ShowEventDetails = function(event) {
          // console.log(event);
          var stringevent = JSON.stringify(event);
          sessionStorage.setItem('currentEvent', stringevent);
          $window.location.href = '/#/dashboard/e/' + eventsType + '/' + event.key;
        }
        //$scope.eventsList = JSON.parse('{"modules": { "module1": { "title": "name of module1","description": "description of module1",            "weeks": {"week1": {"title": "Week 01"}},"module2": {"title": "name of module2", "description": "description of module2",
        // "weeks": { "week2": {"title": "Week 02"},"week3": { "title": "Week 03" } } } } }}')
    }
  ]);