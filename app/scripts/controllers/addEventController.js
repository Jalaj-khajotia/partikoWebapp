'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap.datetimepicker', 'flow', 'toastr', 'ngFileUpload', 'ngImgCrop'])

.controller('addEventCtrl', ['$scope', '$timeout', '$http', 'EventsService', 'toastr', 'Upload',
  function($scope, $timeout, $http, EventsService, toastr, Upload) {

    /*
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

    function saveEvent(event) {
      EventsService.AddEvents(event, function() {
          $scope.newEvent = null;
          $scope.coverPic = null;
          toastr.success('Event added successfully', 'Success!');
          sessionStorage.removeItem('allEvents');
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
            alert("Upload other image");
          }
        }
      };
      xhr.send();
    }

    function upload_file(file, signed_request, url, event) {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", signed_request);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(xhr);
          var localevent = $scope.newEvent;
          localevent.start_time = "2015-10-28T10:00:00";
          var index = xhr.responseURL.indexOf('?');
          var coverUrl = xhr.responseURL.split("?")[0];
          console.log(coverUrl);
           localevent.cover = coverUrl;
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


    $scope.AddEvent = function(event) {
      $scope.newEvent = event;
      console.log(event); 

      uploadImageandSaveEvent($scope.coverPic, event);

    };
  }
]);