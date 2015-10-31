'use strict';

angular.module('sbAdminApp')

.factory('EventsService', ['$http', '$rootScope', '$timeout',
  function($http, $rootScope, $timeout) {
    var service = {};
    //'eyJrZXkiOiIwY2NhMWI1OWI0NjA1ZDU3In0.CQa6dA.BCTl2PTbykDdrgG_qUEvru2-HR0';//  
    var authdata = sessionStorage.getItem('token');
    var encodedData = btoa(authdata + ":partiko");
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['Authorization'] = 'Basic ' + encodedData;

    service.GetEvents = function(callback) {
      return $http.post('http://web.partiko.com/merchant/events', {
          "offset": 0
        })
        .then(function(response) {
          callback(response);
          return response;
        }, function(error) {
          var data = error.data;
          return error;
          // not relevant
        });

    };

    service.DeleteEvent = function(eventkey) {
      // change to http://web.partiko.com/merchant/event
      var req = {
        method: 'DELETE',
        url: 'http://api.partiko.com/merchant/event',
        data: {
          event_key: eventkey
        }
      };
      /* var deletejson = JSON.parse('{"event_key" :'+ eventkey+'}');*/
      return $http(req)
        .then(function(response) {
          return response;
        }, function(error) {
          return error;
        });

      /*  return $http.delete('http://api.partiko.com/merchant/event', deletejson)
                .then(function(response){
                     return response;
                 },function(error){
                    return error;
                 });
*/
    };

    service.EditEvents = function(event, callback,error) {
      return $http.put('http://web.partiko.com/merchant/event', event)
        .then(function(response) {
          callback();
          return response;
        }, function(error) {
          error();
          return error;
        });
    };

    service.AddEvents = function(event, callback, failure) {

      $http.post('http://web.partiko.com/merchant/event', event)
        .success(function(response) {
          callback();
          return response;

        }).error(function(error) {
          failure();
        });

    };
    return service;
  }
]);