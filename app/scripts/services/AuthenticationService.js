'use strict';

angular.module('sbAdminApp')

.factory('AuthenticationService',
    [ '$http','$window',
    function ( $http, $window) {   

     var service = {};

     service.Login = function (username, password, callback) {
          var body = '{"email" :"' + username +'", "password" :"'+ password +'" }'; 

          $http({method: 'POST', url: 'http://api.partiko.com/merchant/login',data:body})
                .then(function(response) {
                  /*$scope.status = response.status;
                  $scope.data = response.data;*/
                 // console.log( response.status);
                  if( response.data.status)
                  {
                     $window.location.href ="/#/dashboard/home";
                     sessionStorage.setItem('token', response.data.token);
                  }
                  else{            
                  }
                }, function(response) {
                 alert("Either password or username is wrong");
              });   
        };

      service.Logout = function(){
        sessionStorage.clear();
         $window.location.href ="/#/login";
      };

        return service;
    }]);