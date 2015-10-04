'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LoginCtrl', function($scope, $window) {
  
  $scope.Login = function(loginObj){
  	var username = loginObj.username;
  	var pass = loginObj.password;
  	if(username === "test@test.com" && pass === "test")
  	{
  		$window.location.href ="#/dashboard.home";
  	}

  		console.log(username +" "+ pass );
  };

    
});