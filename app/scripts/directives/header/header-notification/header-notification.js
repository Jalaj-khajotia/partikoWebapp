'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification', function() {
		return {
			templateUrl: 'scripts/directives/header/header-notification/header-notification.html',
			restrict: 'E',
			replace: true,
			controller: ['AuthenticationService', '$scope', '$rootScope', function(AuthenticationService, $scope, $rootScope) {
				function LoadMerchantProfile() {
					AuthenticationService.GetProfile().then(function(response) {
						$scope.merchantName = response.data.data.name;
						console.log($rootScope.name);
						$scope.profile = response.data;
					}, function() {

					})
				}
				LoadMerchantProfile()
				
				console.log($scope.merchantName);
			}]
		}
	});