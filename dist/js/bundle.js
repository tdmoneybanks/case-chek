'use strict';

var caseChekApp = angular.module('caseChekApp', ['angularModalService']);

caseChekApp.controller('AppController', ['$scope', 'chicagoDataService', function AppController($scope, chicagoDataService) {
    $scope.searchText = '';
    $scope.keys = {
        name: true,
        type: true,
        results: true
    };
    $scope.data = [];
    $scope.page = 1;
    $scope.hasMore = false;

    $scope.search = function () {
        $scope.page = 1;
        $scope.hasMore = true;
        var keyArray = Object.keys(_.pickBy($scope.keys, function (value) {
            return value;
        }));
        chicagoDataService.getData({ searchText: $scope.searchText, page: 1, keys: keyArray.join() }).then(function (response) {
            $scope.data = response.data;
            $scope.hasMore = response.data.length < 15 ? false : true;
        });
    };

    $scope.$watch('page', function () {
        chicagoDataService.getData({ searchText: $scope.searchText, page: $scope.page }).then(function (response) {
            $scope.data = response.data;
            $scope.hasMore = response.data.length < 15 ? false : true;
        });
    });
}]);
'use strict';

/**
 * Service to get the chicago data from express server and pass query params
 */

// TODO: (enhancement) refactor this key to env variable then queried from express
var gooleApiKey = 'AIzaSyA5IGNDHog2WvQgwH0Qj-YlPbA_FS_q52k';

caseChekApp.service('chicagoDataService', function ($http) {

    /**
     *
     * @param options - query param options for search and advanced search
     * @return {Promise} - returns http promise of chicago data
     */
    this.getData = function (options) {
        var params = options || {};
        return $http({
            method: 'GET',
            url: '/chicago-data',
            params: {
                'searchQuery': params.searchText || '',
                'page': params.page || '1',
                'keywords': params.keys || 'name,type,results'
            },
            headers: {}
        });
    };
});
'use strict';

caseChekApp.controller('ListController', ['$scope', 'chicagoDataService', 'ModalService', function ListController($scope, chicagoDataService, ModalService) {

    chicagoDataService.getData({ searchText: $scope.searchText, page: $scope.page }).then(function (response) {
        $scope.$parent.data = response.data;
        $scope.$parent.hasMore = response.data.length < 15 ? false : true;
    });

    // TODO: refactor, this can probably be done in the template
    $scope.onPageOne = function () {
        return $scope.page === 1;
    };

    $scope.handleClick = function (data) {
        ModalService.showModal({
            templateUrl: '../templates/details-modal.html',
            controller: function controller() {
                this.data = data || { name: 'test' };
                this.violationCount = $scope.violationCount(data.inspection.violations);
                this.trimmedViolations = $scope.trimmedViolations(data.inspection.violations);
                this.url = $scope.url(data, "400x500");
                this.inspectionDate = moment(data.inspection.inspectionDate).format("L");
            },
            controllerAs: 'detailsModalController'
        }).then(function (modal) {
            modal.element.modal();
        });
    };

    // TODO: move this violation data alteration to the backend?
    $scope.violationCount = function (violations) {
        return violations.substr(0, violations.indexOf('.')) || '0';
    };

    $scope.trimmedViolations = function (violations) {
        return violations.substr(violations.indexOf(' ')) || 'No Violations Found';
    };

    $scope.url = function (data) {
        var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "300x275";

        if (data.locationData.address) {
            var addressUri = encodeURIComponent(data.locationData.address);
            return 'https://maps.googleapis.com/maps/api/streetview?size=' + size + '&location=' + addressUri + '&fov=90&heading=235&pitch=10&key=' + gooleApiKey;
        }
    };
}]);
'use strict';

/**
 * This is currenly an un-used service. TODO enhancement would be to use this service to do error checking with api
 */
caseChekApp.service('googleStreetViewService', function ($http) {

    /**
     *
     * @param location - address or set of lat/long coordinates
     * @return {Promise} - returns an http get promise
     */
    this.getData = function (location) {
        return $http({
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + location + '&fov=90&heading=235&pitch=10&key=' + gooleApiKey,
            params: '',
            headers: {}
        });
    };
});
//# sourceMappingURL=bundle.js.map
