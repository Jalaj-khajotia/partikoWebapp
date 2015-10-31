'use strict';
/**
 * @ngdoc function
 *
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap.datetimepicker', 'toastr', 'ngDialog'])

.controller('addEventCtrl', ['$scope', '$timeout', '$http', 'EventsService', 'toastr', 'ImageUploadService',
  'AuthenticationService',
  function($scope, $timeout, $http, EventsService, toastr, ImageUploadService, AuthenticationService) {

    AuthenticationService.CheckForLoggedin();
    $scope.Heading = "List your Event in just few clicks";

    function convertTime(time) {
      var LocalTime = moment(time);
      return moment(LocalTime).format('YYYY-MM-DDTHH:mm:ss');
    }

    function saveEvent(event) {
   

      EventsService.AddEvents(event, function() {
          toastr.success('Event added successfully', 'Success!');
             $('#loadingAnimation').hide();
            sessionStorage.removeItem('allEvents');
          ResetPage();
        },
        function() {
          toastr.error('Try again', 'Error!');
        });
    }

    function get_signed_request(file, event) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://web.partiko.com/campus/sign_s3?folder_name=events-pic&file_type=" + file.type);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            upload_filetoS3(file, response.signed_request, response.url, event);
          } else {
            toastr.error('Upload another photo', 'Error!');
            $('#loadingAnimation').hide();
          }
        }
      };
      xhr.send();
    }

    function ResetPage() {
      $('#preview-pic').attr('src', '');
      $scope.newEvent = null;
      $scope.coverPic = null;
      $scope.eventStartTime = '';
    }

    function _initilize() {
      $scope.uploadedImage = null;
    }

    function GetEventObjForSaving(XhrResponseforCoverUrl, EventTime, Event) {
      var coverUrl = '';
      if (XhrResponseforCoverUrl !== '') {
        coverUrl = XhrResponseforCoverUrl.responseURL.split("?")[0];
      }
      Event.start_time = convertTime(EventTime);
      Event.cover = coverUrl;
      return Event;
    }

    function upload_filetoS3(file, signed_request, url, event) {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", signed_request);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(xhr);
          var localevent = GetEventObjForSaving(xhr, $scope.eventStartTime, $scope.newEvent);
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

    $scope.onTimeSet = function(newDate, oldDate) {}

    $scope.setFiles = function(element) {

      var reader = new FileReader();
      reader.onload = function(e) {
        //$scope.uploadedImage = e.target.result;
        $('#preview-pic').attr('src', e.target.result);
      }
      reader.readAsDataURL(element.files[0]);
      $scope.uploadedImage = element.files[0];      
    };

    $scope.AddEvent = function(event) {

      $('#loadingAnimation').show();

      $scope.newEvent = event;
      if ($scope.eventStartTime === undefined) {      
        toastr.error('Add event Date and Time', 'Error!');
      } else {
        if ($scope.uploadedImage == null) {
          var localevent = GetEventObjForSaving('', $scope.eventStartTime, $scope.newEvent);
          saveEvent(localevent);
        } else {
          uploadImageandSaveEvent($scope.uploadedImage, $scope.newEvent);
        }
      }      
    };
    _initilize();
  }
])
.controller('LoadingLogoCtrl', ['toastr', '$scope', 'ngDialog', '$rootScope',
  function(toastr, $scope, ngDialog, $rootScope) {

    $rootScope.closeDialog = function() {
      ngDialog.close('ngdialog1');
    }

  }
]);