'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['toastr'])
  .controller('editEventCtrl', ['$scope', '$window', '$http', 'AuthenticationService', '$stateParams','toastr',
    function($scope, $window, $http, AuthenticationService, $stateParams, toastr) {

      var eventKey = $stateParams.key;
      console.log(eventKey);

      $scope.AddEvent = function() {

        $('#loadingAnimation').show();

        $scope.newEvent = event;
        if ($scope.eventStartTime === undefined) {
          $('#loadingAnimation').hide();
          toastr.error('Add event Date and Time', 'Error!');
        } else {
          if ($scope.confirmed == null || event.cover === $scope.confirmed) {
            var localevent = GetEventForSaving('', $scope.eventStartTime, $scope.newEvent);
            saveEvent(localevent);
          } else {
            uploadImageandSaveEvent($scope.confirmed, $scope.newEvent);
          }
        }
      }

      function LoadEvent() {
        var event = sessionStorage.getItem('EditEventDetails');
        var currentEvent = JSON.parse(event);
        $scope.newEvent = {};
        $scope.newEvent.category = currentEvent.category;
        $scope.newEvent.name = currentEvent.name;
        $scope.newEvent.description = currentEvent.description;
        $scope.newEvent.tags = currentEvent.tags;
        $scope.eventStartTime = currentEvent.start_time; //convert epoch time
        $scope.confirmed = currentEvent.cover; //image model
        $scope.newEvent.cover = currentEvent.cover;
        $scope.newEvent.location = currentEvent.place;
        $scope.newEvent.price = currentEvent.price;
        $('#preview-pic').attr('src', currentEvent.cover);
      }

      function get_signed_request(file, event) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://web.partiko.com/campus/sign_s3?folder_name=events-pic&file_type=" + file.type);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              var response = JSON.parse(xhr.responseText);
              upload_file(file, response.signed_request, response.url, event);
            } else {
              toastr.error('Upload another photo', 'Error!');
              $('#loadingAnimation').hide();
            }
          }
        };
        xhr.send();
      }

      function GetEventForSaving(XhrResponseforCoverUrl, EventTime, Event) {
        var coverUrl = '';
        if (XhrResponseforCoverUrl !== '') {
          coverUrl = XhrResponseforCoverUrl.responseURL.split("?")[0];
        }
        if ($scope.newEvent.cover !== "") {
          coverUrl = $scope.newEvent.cover;
        }
        Event.start_time = convertTime(EventTime);
        Event.cover = coverUrl;
        return Event;
      }

      function upload_file(file, signed_request, url, event) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_request);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function() {
          if (xhr.status === 200) {
            console.log(xhr);
            var localevent = GetEventForSaving(xhr, $scope.eventStartTime, event);
            // 'Wed Oct 14 2015 14:30:00 GMT+0530 (India Standard Time)' 
            saveEvent(localevent);
          }
        };
        xhr.onerror = function() {
          alert("Could not upload file.");
        };
        xhr.send(file);
      }

      function uploadImageandSaveEvent(file, event) {
        get_signed_request(file, event);
      }

      function convertTime(time) {
        var LocalTime = moment(time);
        return moment(LocalTime).format('YYYY-MM-DDTHH:mm:ss');
      }

      function saveEvent(event) {
        $('#loadingAnimation').hide();

        EventsService.AddEvents(event, function() {
            toastr.success('Event added successfully', 'Success!');
            sessionStorage.removeItem('allEvents');
            ResetPage();
          },
          function() {
            toastr.error('Try again', 'Error!');
          });
      }

      $scope.onTimeSet = function(newDate, oldDate) {
        console.log(newDate);
        console.log(oldDate);
      }
      $scope.setFiles = function(element) {

        console.log('files:', element.files);
        var reader = new FileReader();
        reader.onload = function(e) {
          //$scope.confirmed = e.target.result;
          $('#preview-pic').attr('src', e.target.result);
        }
        reader.readAsDataURL(element.files[0]);
        $scope.confirmed = element.files[0];

        // Turn the FileList object into an Array
        /*   $scope.files = []
           for (var i = 0; i < element.files.length; i++) {
             $scope.files.push(element.files[i])
           }*/
        $scope.progressVisible = false
      };

      function _initilize() {
        LoadEvent();
        $scope.Heading = "Edit your event";
      }

      _initilize();
    }
  ]);