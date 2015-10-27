'use strict';

angular.module('sbAdminApp')

.factory('ImageUploadService', ['$http', '$window',
function($http, $window) {

  var service = {};

  function GetSignedRequestandURL(image) {
    return $http({
        method: 'GET',
        url: 'http://web.partiko.com/campus/sign_s3?folder_name=events-pic&file_type=' + image.type
      })
      .then(function(response) {
        return response;
      }, function(response) {
        return response;
      });
  }

  service.UploadImage = function(image) {
    return GetSignedRequestandURL(image).then(function(response) {
      $http.defaults.headers.common['x-amz-acl'] = 'public-read';
      return $http({
          method: 'PUT',
          url: response.signed_request,
          body: image
        })
        .then(function(response) {
          console.log("success");
          return response;
        }, function(error) {
           console.log("error uploading data using signed request");
          return error;
        });
    }, function(error) {
       console.log("error while getting signed request url");
      return error;
    });

  };

/*
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
      localevent.start_time = convertTime($scope.newEvent.start_time); // 'Wed Oct 14 2015 14:30:00 GMT+0530 (India Standard Time)'
      $('#preview-pic').attr('src', '');
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
}*/

return service;
}]);