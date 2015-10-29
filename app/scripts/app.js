'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
      });

      $urlRouterProvider.otherwise('/login');

      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'views/dashboard/main.html',
          resolve: {
            loadMyDirectives: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: [
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'toggle-switch',
                  files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                    "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'ngAnimate',
                  files: ['bower_components/angular-animate/angular-animate.js']
                })
              $ocLazyLoad.load({
                name: 'ngCookies',
                files: ['bower_components/angular-cookies/angular-cookies.js']
              })
              $ocLazyLoad.load({
                name: 'ngResource',
                files: ['bower_components/angular-resource/angular-resource.js']
              })
              $ocLazyLoad.load({
                name: 'ngSanitize',
                files: ['bower_components/angular-sanitize/angular-sanitize.js']
              })
              $ocLazyLoad.load({
                name: 'ngTouch',
                files: ['bower_components/angular-touch/angular-touch.js']
              })
            }
          }
        })
        .state('login', {
          url: '/login',
          controller: 'LoginCtrl',
          templateUrl: 'views/pages/login.html',
          resolve: {
            loadMyFiles: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: [
                  'scripts/controllers/loginController.js'
                ]
              })
            }
          }
        })
        .state('dashboard.home', {
          url: '/home',
          controller: 'MainCtrl',
          templateUrl: 'views/dashboard/home.html',
          resolve: {
            loadMyFiles: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: [
                  'scripts/controllers/mainController.js',
                  'scripts/directives/timeline/timeline.js',
                  'scripts/directives/notifications/notifications.js',
                  'scripts/directives/chat/chat.js',
                  'scripts/directives/dashboard/stats/stats.js'
                ]
              })
            }
          }
        })
        .state('dashboard.addEvents', {
          templateUrl: 'views/eventpages/add-event.html',
          url: '/add-event',
          controller: 'addEventCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'toastr.js',
                  files: [
                    'bower_components/angular-toastr/dist/angular-toastr.css',
                    'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
                    'bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
                    'bower_components/SpinKit/css/spinkit.css',
                    'bower_components/SpinKit/css/spinners/11-folding-cube.css',
                    'bower_components/angular-resource/angular-resource.js',
                    'bower_components/ng-dialog/css/ngDialog.css',
                    'bower_components/ng-dialog/css/ngDialog-theme-default.css',
                    'bower_components/ng-dialog/css/ngDialog-theme-plain.css',
                    'bower_components/ng-dialog/js/ngDialog.js'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/addEventController.js']
                })
            }
          }
        })
        .state('eventDetail', {
          templateUrl: 'views/eventpages/event-details.html',
          url: '/e/:type/:key',
          controller: 'EventDetailsCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'chart.js',
                  files: [
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                    'bower_components/angular-chart.js/dist/angular-chart.css',
                    'styles/detailEvent.css'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/eventDetailsController.js']
                })
            }
          }
        })
        .state('dashboard.events', {
          templateUrl: 'views/eventpages/events.html',
          url: '/events?type',
          controller: 'EventCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'toastr.js',
                  files: [
                    'bower_components/angular-toastr/dist/angular-toastr.css',
                    'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
                    'bower_components/ng-dialog/css/ngDialog.css',
                    'bower_components/ng-dialog/css/ngDialog-theme-default.css',
                    'bower_components/ng-dialog/css/ngDialog-theme-plain.css',
                    'bower_components/ng-dialog/js/ngDialog.js'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/eventController.js']
                })
            }
          }
        }).state('dashboard.eventsearch', {
          templateUrl: 'views/eventpages/events.html',
          url: '/searchResult?search',
          controller: 'EventCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'chart.js',
                  files: [
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                    'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/eventController.js']
                })
            }
          }
        })
        .state('dashboard.buttons', {
          templateUrl: 'views/ui-elements/buttons.html',
          url: '/buttons'
        })
        .state('dashboard.notifications', {
          templateUrl: 'views/ui-elements/notifications.html',
          url: '/notifications'
        })
        .state('dashboard.typography', {
          templateUrl: 'views/ui-elements/typography.html',
          url: '/typography'
        })
        .state('dashboard.icons', {
          templateUrl: 'views/ui-elements/icons.html',
          url: '/icons'
        })
        .state('dashboard.grid', {
          templateUrl: 'views/ui-elements/grid.html',
          url: '/grid'
        })
        .state('dashboard.form', {
          templateUrl: 'views/form.html',
          url: '/form'
        })
        .state('dashboard.merchant', {
          templateUrl: 'views/merchantpages/merchant.html',
          url: '/merchant',
          controller: 'ChartCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'chart.js',
                  files: [
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                    'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/chartContoller.js']
                })
            }
          }
        })
        .state('signUp-campus', {
          templateUrl: 'views/signUp-campus/signUp-campus.html',
          url: '/signUp-campus'
        })
        .state('dashboard.ambassadors', {
          templateUrl: 'views/ambassadors/ambassadors.html',
          url: '/ambassadors',
          controller: 'ChartCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'chart.js',
                  files: [
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                    'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/chartContoller.js']
                })
            }
          }
        })
        .state('dashboard.AboutUs', {
          templateUrl: 'views/websitepages/aboutuspage.html',
          url: '/aboutuspage'
        })
        .state('dashboard.mediadynamic', {
          templateUrl: 'views/websitepages/media-dynamic.html',
          url: '/media-dynamic'
        })

      .state('dashboard.branddynamic', {
          templateUrl: 'views/websitepages/brandmanager-dynamic.html',
          url: '/brandmanager-dynamic'
        })
        .state('dashboard.aboutusdynamic', {
          templateUrl: 'views/websitepages/aboutus-dynamic.html',
          url: '/aboutus-dynamic'
        })
        .state('dashboard.clientdynamic', {
          templateUrl: 'views/websitepages/client-dynamic.html',
          url: '/client-dynamic'
        })
        .state('dashboard.BrandManagers', {
          templateUrl: 'views/websitepages/BrandManagers.html',
          url: '/BrandManagers'
        })
        .state('dashboard.Clients', {
          templateUrl: 'views/websitepages/Clients.html',
          url: '/Clients'
        })
        .state('dashboard.Media', {
          templateUrl: 'views/websitepages/Media.html',
          url: '/Media'
        })
        .state('dashboard.blank', {
          templateUrl: 'views/pages/blank.html',
          url: '/blank'
        })
        .state('dashboard.social', {
          templateUrl: 'views/social.html',
          url: '/chart',
          controller: 'ChartCtrl',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'chart.js',
                  files: [
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                    'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                  name: 'sbAdminApp',
                  files: ['scripts/controllers/chartContoller.js']
                })
            }
          }
        })
    }
  ]);