var caseChekApp = angular.module('caseChekApp', []);


caseChekApp.service('chicagoDataService', function($http) {
    this.getData = function() {
        return $http({
            method: 'GET',
            url: '/chicago-data',
            params: 'test=test',
            headers: {}
        });
    }
});
caseChekApp.controller('ListController',['$scope', 'chicagoDataService', function ListController($scope, chicagoDataService) {
    $scope.chicagoData = [];
    chicagoDataService.getData().then((response) => {
        $scope.data = response;
    });
}]);