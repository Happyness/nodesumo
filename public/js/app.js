'use strict';

// Declare app level module which depends on filters, and services

angular.module('sumoApp', [
  'sumoApp.controllers',
  'sumoApp.filters',
  'sumoApp.services',
  'sumoApp.directives'
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
