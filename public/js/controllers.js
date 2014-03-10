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
    controller('addSynonymController', ["$scope", "$http", function ($scope, $http) {
        $scope.submit = function()
        {
            console.log($scope.add_keyword);
            console.log($scope.add_variants);
            console.log($scope.add_index);
            console.log($scope.add_indextype);

            var variants = $scope.add_variants.split(',');
            $.each(variants, function(index, value)
            {
                if (variants[index] != "") {
                    variants[index] = $.trim(value);
                }
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
                 if (data.status == "ok") {
                    angular.element("#result").className = "alert alert-success";

                    if (data.message == null) data.message = "Success";
                 } else {
                     angular.element("#add_result").className = "alert alert-danger";
                 }

                 console.log(data.message);
                 angular.element("#add_result").innerHTML = data.message;
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

    }]).
    controller('addStopwordController', ["$scope", "$http", function ($scope, $http) {
        $scope.submit = function()
        {
            console.log($scope.add_name);
            console.log($scope.add_index);
            console.log($scope.add_indextype);

            var json = {
                name: $scope.add_name,
                index: $scope.add_index,
                indexType: $scope.add_indextype
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8080/rest/add/stopword',
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

    }]).
  controller('managementController', function ($scope, $http) {
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

        angular.element('#stop_table').hide();
        angular.element('#syn_table').hide();

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
                    if (type == "stopword") {
                        angular.element('#syn_table').hide();
                        angular.element('#stop_table').show();
                        $scope.stop_result = data;
                    } else {
                        angular.element('#stop_table').hide();
                        angular.element('#syn_table').show();
                        $scope.syn_result = data;
                    }
                }).
                error(function (data, status, headers, config) {
                    $scope.result = 'Error!';
                });
        };

        $scope.deletevariant = function(index, varindex)
        {
            console.log("Keyword Index: " + index);
            console.log("Variant Index: " + varindex);

            if ($scope.syn_result[index] && $scope.syn_result[index].variants[varindex]) {
                console.log($scope.syn_result[index]);
                console.log($scope.syn_result[index].variants[index]);

                var json = JSON.parse(JSON.stringify($scope.syn_result[index]));
                json.variants = [JSON.parse(JSON.stringify($scope.syn_result[index].variants[varindex]))];

                console.log(json);
                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/rest/delete/variant',
                    data: json,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).success(function (data, status, headers, config) {
                        $scope.syn_result[index].variants.splice(varindex, 1);
                        if ($scope.syn_result[index].variants.length < 1) {
                            $scope.syn_result.splice(index, 1);
                        }
                        $scope.result = data.message;
                });
            }
        }

        $scope.deletesynonym = function(index)
        {
            console.log(index);

            if ($scope.syn_result[index]) {
                console.log($scope.syn_result[index]);

                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/rest/delete/synonym',
                    data: $scope.syn_result[index],
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).success(function (data, status, headers, config) {
                        $scope.syn_result.splice(index, 1);
                        $scope.result = data.message;
                });
            }
        }
        $scope.deletestopword = function(index) {
            if ($scope.stop_result[index]) {
                console.log($scope.stop_result[index]);

                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/rest/delete/stopword',
                    data: $scope.stop_result[index],
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).success(function (data, status, headers, config) {
                        $scope.stop_result.splice(index, 1);
                        $scope.result = data.message;
                    });
            }
        }

  });
