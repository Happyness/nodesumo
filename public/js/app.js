'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/add', {
      templateUrl: 'partials/add',
      controller: 'addController'
    }).
    when('/delete', {
      templateUrl: 'partials/delete',
      controller: 'deleteController'
    }).
      when('/search', {
          templateUrl: 'partials/search',
          controller: 'searchController'
      }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
