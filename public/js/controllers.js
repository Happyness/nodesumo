'use strict';

/* Controllers */

angular.module('sumoApp.controllers', []).
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
  controller('addController', function ($scope, $http) {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/rest/search/index'
        }).

            success(function (data, status, headers, config) {
                $scope.indexes = data;
            });

        $http({
            method: 'GET',
            url: 'http://localhost:8080/rest/search/indextype'
        }).

            success(function (data, status, headers, config) {
                $scope.indexTypes = data;
            });

  }).
  controller('deleteController', function ($scope, $http) {
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
