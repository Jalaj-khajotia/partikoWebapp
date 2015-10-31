'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebar', ['$location', function() {
    return {
      templateUrl: 'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {},
      controller: function($scope, $window) {
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;

        $scope.check = function(x) {

          if (x == $scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };

        $scope.handle = function(keyEvent) {
          if (keyEvent.which === 13) {
            $window.location.href = '/#/dashboard/searchResult?search=' + $scope.keyword;
          }
        }

        $scope.multiCheck = function(y) {

          if (y == $scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };

        function _initilize() {
          $scope.disable = true;
        }
        _initilize();
      }
    }
  }]);