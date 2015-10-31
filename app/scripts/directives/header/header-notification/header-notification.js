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
						sessionStorage.setItem('merchantProfile', JSON.stringify(response.data.data));
						$scope.profile = response.data;
					}, function() {

					})
				}

				function _initilize() {
					var isUserLoggedin = sessionStorage.getItem('LoggedIn');
					if (isUserLoggedin === "true") {
						var merchantProfile = sessionStorage.getItem('merchantProfile');
						$scope.merchantName = JSON.parse(merchantProfile).name;
					} else {
						sessionStorage.setItem('LoggedIn', 'true');
						LoadMerchantProfile();
					}
					console.log($scope.merchantName);
					$scope.disable = true;
				}

				_initilize();


			}]
		}
	});