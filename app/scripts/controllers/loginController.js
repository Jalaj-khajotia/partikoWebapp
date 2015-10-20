'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LoginCtrl', ['$scope', '$window', '$http','AuthenticationService',
    function($scope, $window, $http,AuthenticationService) {
  
  $scope.Login = function(loginObj){
  	var username = loginObj.username;
  	var pass = loginObj.password;

    AuthenticationService.Login(username,pass);


  //	if(username === "test@test.com" && pass === "test")
  /*	{var  body = '{"email" :"' + username +'", "password" :"'+ pass +'" }'; 
  		console.log(body);
  		  $http({method: 'POST', url: 'http://api.partiko.com/merchant/login',data:body}).
        then(function(response) {
          $scope.status = response.status;
          $scope.data = response.data;
          console.log( response.status);
          if( response.data.status)
          {
             $window.location.href ="/#/dashboard/home";
             sessionStorage.setItem('token', response.data.token);
          }
          else{
            ;
          }
        }, function(response) {
         alert("Either password or username is wrong");
      });
    //   
    }	*/
  	//else{
  		//alert("Either password or username is wrong");
  	//}

  		console.log(username +" "+ pass );
  };

    
}]);