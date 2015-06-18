'use strick';

app = angular.module('app', [
  'ngRoute',
  'app.directive',
  'app.controller'
  ]);
app.config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/home'
      })
      .when('/detail/:id', {
        templateUrl: '/detail'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
