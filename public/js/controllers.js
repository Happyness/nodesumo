'use strict';

var responseMode = 3;

function setResponseMessage(data, error)
{
    console.log("Calling response message");

    var responseElement = $('#response');

    if (data.status.toLowerCase() == "ok") {
        responseMode = 1;
        //responseElement.attr("class", "alert alert-success");

        if (data.message == null) data.message = "Success";
    } else {
        responseMode = 2;
        //responseElement.attr("class", "alert alert-danger");
    }

    responseElement.show();
    responseElement.text(data.message);

    setTimeout(function() {
        responseElement.hide();
        responseMode = 3;
    }, 4000);
}

/* Controllers */
angular.module('sumoApp.controllers', []).
  controller('exportController', function ($scope, $http) {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/rest/export'
        }).
        success(function (data, status, headers, config) {
            data.message = "Successfully exported latest database into XML on server"
            setResponseMessage(data);
         }).
         error(function (data, status, headers, config) {
             data.message("Failed exporting database to XML");
             setResponseMessage(data);
         });
   }).
  controller('indexController', function ($scope) {
    responseMode = 3;

    $scope.responseMode = function()
    {
        return responseMode;
    }
  }).
  controller('navigationController', function ($scope, $location) {
        $('#response').empty();

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
  }).
    controller('addSynonymController', ["$scope", "$http", function ($scope, $http) {
        responseMode = 3;

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
                name: $scope.add_keyword,
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
                 data.message = "Successfully added synonym";
                 setResponseMessage(data);
            }).error(function (data, status, headers, config) {
                 data.message = "Failed adding synonym";
                 setResponseMessage(data);
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
        responseMode = 3;

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
                    data.message = "Successfully added stopword";
                    setResponseMessage(data);
                }).error(function (data, status, headers, config) {
                    data.message = "Failed adding stopword";
                    setResponseMessage(data);
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
        responseMode = 3;
        
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
                    data.message = "Error while searching";
                    setResponseMessage(data);
                });
        };

        $scope.deletevariant = function(index, varindex)
        {
            if ($scope.syn_result[index] && $scope.syn_result[index].variants[varindex]) {
                var json = JSON.parse(JSON.stringify($scope.syn_result[index]));
                json.variants = [JSON.parse(JSON.stringify($scope.syn_result[index].variants[varindex]))];

                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/rest/delete/variant',
                    data: json,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).success(function (data, status, headers, config) {
                    data.message = "Successfully deleted variant: " + $scope.syn_result[index].variants[index].name;
                    setResponseMessage(data);

                    $scope.syn_result[index].variants.splice(varindex, 1);

                    if ($scope.syn_result[index].variants.length < 1) {
                        $scope.syn_result.splice(index, 1);
                    }
                }).error(function (data, status, headers, config) {
                        data.message = "Failed deleting variant: " + $scope.syn_result[index].variants[index].name;
                        setResponseMessage(data);
                });
            }
        }

        $scope.deletesynonym = function(index)
        {
            if ($scope.syn_result[index]) {

                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/rest/delete/synonym',
                    data: $scope.syn_result[index],
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).success(function (data, status, headers, config) {
                        data.message = "Successfully deleted synonym: " + $scope.syn_result[index].keyword;
                        setResponseMessage(data);
                        $scope.syn_result.splice(index, 1);
                    }).error(function (data, status, headers, config) {
                        data.message = "Failed deleting synonym: " + $scope.syn_result[index].keyword;
                        setResponseMessage(data);
                    });
            }
        }
        $scope.deletestopword = function(index) {
            if ($scope.stop_result[index]) {

                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/rest/delete/stopword',
                    data: $scope.stop_result[index],
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).
                    success(function (data, status, headers, config) {
                        data.message = "Successfully deleted stopword: " + $scope.stop_result[index].name;
                        setResponseMessage(data);
                        $scope.stop_result.splice(index, 1);
                    }).error(function (data, status, headers, config) {
                        data.message = "Failed deleting stopword: " + $scope.stop_result[index].name;
                        setResponseMessage(data);
                    });
            }
        }

  });
