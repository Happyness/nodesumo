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
  controller('navigationController', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
  }).
  controller('addController', function ($scope, $http) {
        $scope.submit = function()
        {
            console.log($scope.add_keyword);
            console.log($scope.add_variants);
            console.log($scope.add_index);
            console.log($scope.add_indextype);

            var variants = $scope.add_variants.split(',');
            $.each(variants, function(index, value)
            {
                variants[index] = $.trim(value);
            });

            var json = {
                keyword: $scope.add_keyword,
                variants: variants,
                index: $scope.add_index,
                indexType: $scope.add_indextype
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8080/rest/add/synonym',
                data: json,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).success(function (data, status, headers, config) {
                    $scope.result = data;
            });
        }

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
        $scope.searchTypes = [{id: 'keyword', label: 'Keyword'},
            {id: 'variant', label: 'Variant'},
            {id: 'stopword', label: 'Stopword'}];

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

        $scope.submit = function()
        {
            console.log($scope.search_word);
            console.log($scope.search_type);
            console.log($scope.search_index);
            console.log($scope.search_indextype);

            var index = $scope.search_index;
            var indexType = $scope.search_indextype;
            var word = $scope.search_word;
            var type = $scope.search_type;
            var uriPart = '';

            if (type == 'variant' || type == 'keyword') {
                uriPart += '/synonym'
            }

            $http({
                method: 'GET',
                url: 'http://localhost:8080/rest/search' + uriPart + '/' + type + '/' + word + '/' + index + '/' + indexType
            }).

                success(function (data, status, headers, config) {
                    $scope.result = data;
                }).
                error(function (data, status, headers, config) {
                    $scope.result = 'Error!';
                });
        };
    });
