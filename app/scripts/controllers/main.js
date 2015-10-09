'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl',['$scope', '$window', function($scope, $window) {
  	var token = sessionStorage["token"];
  	
  	if(!token)
  	{  		
		// $window.location.href ="/#/Login";
  	}
  	else
  	{  		
  	}

$scope.LogOut = function ()
{
	console.log("i am getting called");
}
console.log("i am getting called");
  }]);
