'use strict';

angular.module('sbAdminApp')
  .controller('EventCtrl', ['$scope', '$window', '$http', 'EventsService', '$stateParams',
    function($scope, $window, $http, EventsService, $stateParams) {

      var eventsType = $stateParams.type;       
      $scope.eventsList= {};

function GetDate (){
                var today = new Date();
              var dd = today.getDate();
              var mm = today.getMonth()+1; //January is 0!
              var yyyy = today.getFullYear();

              if(dd<10) {
                  dd='0'+dd
              } 

              if(mm<10) {
                  mm='0'+mm
              } 
              today = mm+'/'+dd+'/'+yyyy;
              return today ;
          }

 $scope.LoadEvents = function(Type){
    var checkForSavedEvents =  sessionStorage.getItem('allEvents');
   if(!!checkForSavedEvents)
   {
 //   console.log("in true "+ checkForSavedEvents);
      $scope.eventsList = JSON.parse(checkForSavedEvents);
   }
   else{
   // console.log("in else "+checkForSavedEvents );
    EventsService.GetEvents(function(){})
     .then(function(response){
            //  console.log(response.data.events);
                $scope.eventsList = response.data.events;
               sessionStorage.setItem('allEvents',JSON.stringify(response.data.events));  
     });
   }
     var todayDate = GetDate();
  
   //need to make sessionStorage.clear
   //  console.log($scope.eventsList.length);
 }

      $scope.LoadEvents(eventsType);

    $scope.DeleteEvent = function(event){
      console.log('deleting event'+ event);
      EventsService.DeleteEvent(event.key).then(function(response){
        console.log(response);
      });
   
    }
    
  $scope.ShowEventDetails = function(event)
  {
   // console.log(event);
    var stringevent = JSON.stringify(event);
    sessionStorage.setItem('currentEvent',stringevent);
      $window.location.href  = '/#/dashboard/event';
  }
     //$scope.eventsList = JSON.parse('{"modules": { "module1": { "title": "name of module1","description": "description of module1",            "weeks": {"week1": {"title": "Week 01"}},"module2": {"title": "name of module2", "description": "description of module2",
               // "weeks": { "week2": {"title": "Week 02"},"week3": { "title": "Week 03" } } } } }}')
     
    
}]);