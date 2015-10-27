'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.controller('EventDetailsCtrl', ['$scope', '$window','AuthenticationService', function($scope, $window, AuthenticationService) {

		$scope.LoadEvent = function(event) {
			var event = sessionStorage.getItem('currentEvent');
			$scope.currentEvent = JSON.parse(event);

			if($scope.currentEvent.cover === "" )
			{
				$scope.showFallBackImg = true;
			}
			else{
					$scope.showFallBackImg = false;
			}
		}
		AuthenticationService.CheckForLoggedin();
		$scope.LoadEvent();
	}]);