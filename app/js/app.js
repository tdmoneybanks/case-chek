'use strict';

const caseChekApp = angular.module('caseChekApp', []);

const gooleApiKey = 'AIzaSyA5IGNDHog2WvQgwH0Qj-YlPbA_FS_q52k';

caseChekApp.service('chicagoDataService', function($http) {
    this.getData = function(options) {
        const params = options || {};
        return $http({
            method: 'GET',
            url: '/chicago-data',
            params: {
                'searchQuery': params.searchText || '',
                'page': params.page || '1'
            },
            headers: {}
        });
    }
});

caseChekApp.service('googleStreetViewService', function($http) {
    this.getData = function(location) {
        return $http({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${location}&fov=90&heading=235&pitch=10&key=${gooleApiKey}`,
            params: '',
            headers: {}
        });
    }
})

caseChekApp.controller('AppController', ['$scope', 'chicagoDataService', function AppController($scope, chicagoDataService) {
    $scope.searchText = '';
    $scope.data = [];
    $scope.page = 1;
    $scope.hasMore = true;


    $scope.search = function() {
        $scope.page = 1;
        $scope.hasMore = true;
        chicagoDataService.getData({searchText: $scope.searchText, page: 1}).then((response) => {
            $scope.data = response.data;
        });
    }

    $scope.$watch('page', function() {
        chicagoDataService.getData({searchText: $scope.searchText, page: $scope.page}).then((response) => {
            $scope.data = response.data;
            $scope.hasMore = response.data.length < 15 ? false : true;
        });
    });
}]);

caseChekApp.controller('ListController',['$scope', 'chicagoDataService', 'googleStreetViewService', function ListController($scope, chicagoDataService, googleStreetViewService) {
    chicagoDataService.getData({searchText: $scope.searchText, page: $scope.page}).then((response) => {
        $scope.$parent.data = response.data;
    });
    $scope.onPageOne = function() {
        return $scope.page === 1;
    }

    $scope.handleClick = function(data) {
        $('.modal').modal('show');
    }
    $scope.url = function(data) {
        if (data.locationData.address) {
            const addressUri = encodeURIComponent(data.locationData.address);
            return `https://maps.googleapis.com/maps/api/streetview?size=300x200&location=${addressUri}&fov=90&heading=235&pitch=10&key=${gooleApiKey}`;
        }
    };
}]);