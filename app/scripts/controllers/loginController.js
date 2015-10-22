'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LoginCtrl', ['$scope', '$window', '$http', 'AuthenticationService',
    function($scope, $window, $http, AuthenticationService) {

      $scope.Login = function(loginObj) {

        var username = loginObj.username;
        var pass = loginObj.password;
        AuthenticationService.Login(username, pass);
      };

      $scope.Logout = function() {
        AuthenticationService.Logout();
      }
      $scope.Logout();


    }
  ]);