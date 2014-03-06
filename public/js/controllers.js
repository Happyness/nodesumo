'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('addController', function ($scope) {
    // write Ctrl here

  }).
  controller('deleteController', function ($scope) {
    // write Ctrl here

  }).
    controller('searchController', function($scope, $http) {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/rest/search/synonym/keyword/*/*/*'
        }).

            success(function (data, status, headers, config) {
                $scope.result = data;
            }).
            error(function (data, status, headers, config) {
                $scope.result = 'Error!';
            });
    });
