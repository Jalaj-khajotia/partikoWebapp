'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap.datetimepicker', 'toastr', 'ngDialog'])

.controller('addEventCtrl', ['$scope', '$timeout', '$http', 'EventsService', 'toastr', 'ImageUploadService',
  function($scope, $timeout, $http, EventsService, toastr, ImageUploadService) {

    /*  $rootScope.closeDialog
          $scope.upload = function(dataUrl) {
              console.log(dataUrl);
            

              Upload.upload({
                  url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                  data: {
                      file: Upload.dataUrltoBlob(dataUrl)
                  },
              }).then(function (response) {
                  $timeout(function () {
                      $scope.result = response.data;
                  });
              }, function (response) {
                  if (response.status > 0) $scope.errorMsg = response.status 
                      + ': ' + response.data;
              }, function (evt) {
                  $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
              });
            }       */
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

    function ResetPage() {
      $('#preview-pic').attr('src', '');
      $scope.newEvent = null;
      $scope.coverPic = null;
      $scope.eventStartTime = '';
    }

    function GetEventForSaving(XhrResponseforCoverUrl, EventTime, Event) {
      var coverUrl = '';
      if (XhrResponseforCoverUrl !== '') {
        var coverUrl = XhrResponseforCoverUrl.responseURL.split("?")[0];
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
          var localevent = GetEventForSaving(xhr, $scope.eventStartTime, $scope.newEvent);
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

    $scope.onTimeSet = function(newDate, oldDate) {
      console.log();
      console.log(newDate);
      console.log(oldDate);
      console.log(convertTime(newDate));
    }

    $scope.change = function() {
      console.log('bye');
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
    $scope.confirmed = null;

    $scope.AddEvent = function(event) {


      //$rootScope.EventtobeDeleted = event;
      /*  ngDialog.open({
        template: 'views/LoadingTemplate.html',
        controller: 'LoadingLogoCtrl',
        className: 'ngdialog-theme-default ngdialog-theme-custom'
      });
*/
      $('#loadingAnimation').show();

      $scope.newEvent = event;
      if ($scope.eventStartTime === undefined) {
        $('#loadingAnimation').hide();
        toastr.error('Add event Date and Time', 'Error!');
      } else {
        if ($scope.confirmed == null) {
          var localevent = GetEventForSaving('', $scope.eventStartTime, $scope.newEvent);
          saveEvent(localevent);
        } else {
          uploadImageandSaveEvent($scope.confirmed, $scope.newEvent);
        }
      }
      console.log($scope.eventStartTime);
    };
  }
]).controller('LoadingLogoCtrl', ['toastr', '$scope', 'ngDialog', '$rootScope',
  function(toastr, $scope, ngDialog, $rootScope) {

    $rootScope.closeDialog = function() {
      ngDialog.close('ngdialog1');
    }
    console.log('i am added');


  }
]);