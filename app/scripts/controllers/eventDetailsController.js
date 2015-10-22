'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.controller('EventDetailsCtrl', ['$scope', '$window', function($scope, $window) {

		$scope.LoadEvent = function(event) {
			var event = sessionStorage.getItem('currentEvent');
			$scope.currentEvent = JSON.parse(event);
			// console.log(event);
		}
		$scope.LoadEvent();
	}]);