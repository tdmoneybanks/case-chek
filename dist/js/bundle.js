'use strict';

var caseChekApp = angular.module('caseChekApp', []);

caseChekApp.service('chicagoDataService', function ($http) {
    this.getData = function () {
        return $http({
            method: 'GET',
            url: '/chicago-data',
            params: 'test=test',
            headers: {}
        });
    };
});
caseChekApp.controller('ListController', ['$scope', 'chicagoDataService', function ListController($scope, chicagoDataService) {
    $scope.chicagoData = [];
    chicagoDataService.getData().then(function (response) {
        $scope.data = response;
    });
}]);
'use strict';

angular.module('caseChekApp').component('listContainer', {
    template: 'Hello, {{$ctrl.user}}!',
    controller: function GreetUserController() {
        this.user = 'world';
    }
});
//# sourceMappingURL=bundle.js.map
