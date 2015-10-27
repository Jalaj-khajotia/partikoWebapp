'use strict';

angular.module('sbAdminApp')

.factory('AuthenticationService', ['$http', '$window', '$rootScope',
  function($http, $window, $rootScope) {

    var service = {};

    service.Login = function(username, password, callback) {
      sessionStorage.clear();
      var body = '{"email" :"' + username + '", "password" :"' + password + '" }';

      $http({
          method: 'POST',
          url: 'http://api.partiko.com/merchant/login',
          data: body
        })
        .then(function(response) {
          /*$scope.status = response.status;
          $scope.data = response.data;*/
          // console.log( response.status);
          if (response.data.status) {
            $window.location.href = "/#/dashboard/home";
            sessionStorage.setItem('token', response.data.token);
            //sessionStorage.setItem('token', 'eyJrZXkiOiIwYmFkZDZlNmIyNjA2MzI3In0.CPxCdA.DnlMGuZdsDzSRupCHe9KY17M9LE');
          } else {}
        }, function(response) {
          alert("Either password or username is wrong");
        });
    };

    service.GetProfile = function() {
      var authdata = sessionStorage.getItem('token');
      var encodedData = btoa(authdata + ":partiko");
      $http.defaults.headers.common['Content-Type'] = 'application/json';
      $http.defaults.headers.common['Authorization'] = 'Basic ' + encodedData;

      return $http.get('http://web.partiko.com/merchant/profile')
        .then(function(response) {          
          return response;
        }, function(error) {
          return error;
        });
    }

    service.CheckForLoggedin = function() {
      var authdata = sessionStorage.getItem('token');
      if (authdata === '' || authdata === null || authdata === 'undefined') {
        $rootScope.LoggedIn = false;
        $window.location.href = "/#/login";
         return $rootScope.LoggedIn;
      } else {
        var encodedData = btoa(authdata + ":partiko");
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        $http.defaults.headers.common['Authorization'] = 'Basic ' + encodedData;

         $http.get('http://web.partiko.com/merchant/profile')
        .then(function(response) {
          $rootScope.LoggedIn = true;          
          return $rootScope.LoggedIn;
        }, function(error) {
          $rootScope.LoggedIn = false;
           $window.location.href = "/#/login";    
            return $rootScope.LoggedIn;     
        });
      }
    }

    service.Logout = function() {
      sessionStorage.clear();
      $window.location.href = "/#/login";
    };

    return service;
  }
]);