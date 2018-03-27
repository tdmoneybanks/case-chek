'use strict';

const caseChekApp = angular.module('caseChekApp', ['angularModalService']);

caseChekApp.controller('AppController', ['$scope', 'chicagoDataService', function AppController($scope, chicagoDataService) {
    $scope.searchText = '';
    $scope.keys = {
        name: true,
        type: true,
        results: true
    }
    $scope.data = [];
    $scope.page = 1;
    $scope.hasMore = false;

    /**
     * real-time search queries based on input tying
     */
    $scope.search = function() {
        $scope.page = 1;
        $scope.hasMore = true;
        const keyArray = Object.keys(_.pickBy($scope.keys, (value) => {
            return value;
        }));
        chicagoDataService.getData({searchText: $scope.searchText, page: 1, keys: keyArray.join()}).then((response) => {
            $scope.data = response.data;
            $scope.hasMore = response.data.length < 15 ? false : true;
        });
    }
    // TODO: could be refactored to not use an expensive watcher but instead event listeners on buttons
    /**
     * Watch for a change on the page variable to update data list by pagination
     */
    $scope.$watch('page', function() {
        chicagoDataService.getData({searchText: $scope.searchText, page: $scope.page}).then((response) => {
            $scope.data = response.data;
            $scope.hasMore = response.data.length < 15 ? false : true;
        });
    });
}]);