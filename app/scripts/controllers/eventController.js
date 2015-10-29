'use strict';

angular.module('sbAdminApp', ['toastr', 'ngDialog'])
  .controller('EventCtrl', ['$scope', '$window', '$http', 'EventsService', '$stateParams', 'toastr', 'ngDialog', '$rootScope',
    'AuthenticationService', function($scope, $window, $http, EventsService, $stateParams, toastr, ngDialog, $rootScope, AuthenticationService) {

      var eventsType = $stateParams.type,
        keyword, pastEvents = [],
        latestEvents = [],
        epoch, isEventsPresentinSession;

      function DisplayEvents(eventsType) {
        console.log("Type =" + eventsType);
        if (eventsType === 'past') {
          $rootScope.filteredEvents = pastEvents;
        } else {
          $rootScope.filteredEvents = latestEvents;
        }
      }

      function _initilize() {
        AuthenticationService.CheckForLoggedin();
        $scope.eventsList = {};
        $rootScope.filteredEvents = {};
        $scope.dialogShown = true;
        $scope.hideSearchBar = true;
        keyword = $stateParams.search;

        if (eventsType !== "" && eventsType !== null && eventsType !== undefined) {
          LoadEvents(eventsType);
        }
        DisplayEvents(eventsType);

        if (keyword !== "" && keyword !== null && keyword !== undefined) {
          $scope.SearchEvent(keyword.toLowerCase());
        } else {
          if (eventsType === 'past') {
            $window.location.href = '/#/dashboard/events?type=past';
          } else {
            $window.location.href = '/#/dashboard/events?type=latest';
          }
        }
      }

      $scope.ConfirmDelete = function(event) {
        $rootScope.EventtobeDeleted = event;
        ngDialog.open({
          template: 'views/template.html',
          controller: 'DialogCtrl',
          className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
      };

      $scope.ShowEventDetails = function(event) {
        var stringevent = JSON.stringify(event);
        sessionStorage.setItem('currentEvent', stringevent);
        $window.location.href = '#/e/' + eventsType + '/' + event.key;
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
        $rootScope.filteredEvents = null;
        if (pastEvents.length > 0) {
          latestEvents.push(pastEvents);
        }
        //$scope.filteredEvents.push(latestEvents); 
        debugger;
        $rootScope.filteredEvents = latestEvents;
        console.log("result of search");
        console.log($rootScope.filteredEvents);
      }

      function LoadEventsFromSession() {
        $scope.eventsList = JSON.parse(isEventsPresentinSession);
      }

      function CheckLastSession() {
        isEventsPresentinSession = sessionStorage.getItem('allEvents');
      }

      function LoadDateTimeFunction() {
        Date.prototype.today = function() {
          return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
        }
        Date.prototype.timeNow = function() {
          return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }
      }

      function ProcessEvents(Type) {
        var today = new Date();
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
            ProcessEvents(eventsType);
          });
      }

      function LoadEvents(Type) {
        CheckLastSession();
        LoadDateTimeFunction();

        if (isEventsPresentinSession !== 'undefined' && isEventsPresentinSession != null && isEventsPresentinSession != '') {
          LoadEventsFromSession();
          ProcessEvents(eventsType);
        } else {
          LoadEventfromEventService();
        }
      };

      _initilize();
    }
  ])
  .controller('DialogCtrl', ['EventsService', 'toastr', '$scope', 'ngDialog', '$rootScope', function(EventsService, toastr, $scope, ngDialog, $rootScope) {

    $scope.closeDialog = function() {
      ngDialog.close('ngdialog1');
    }

    $scope.DeleteEvent = function() {
      ngDialog.close('ngdialog1');
      EventsService.DeleteEvent($rootScope.EventtobeDeleted.key).then(function(response) {
        toastr.success('Event deleted successfully', 'Success!');
        sessionStorage.removeItem('allEvents');
        var afterDeleteEvents = [];
        angular.forEach($rootScope.filteredEvents, function(currentEvent) {
          if (currentEvent.key !== $rootScope.EventtobeDeleted.key && currentEvent.key !== undefined && currentEvent.key !== null && currentEvent.key !== '') {
            afterDeleteEvents.push(currentEvent);
          }
        });
        $rootScope.filteredEvents = afterDeleteEvents;
      }, function() {
        toastr.success('Event deleting failed', 'Error!');
      });
    }

  }]);