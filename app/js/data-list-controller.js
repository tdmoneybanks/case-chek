caseChekApp.controller('ListController',['$scope', 'chicagoDataService', 'ModalService', function ListController($scope, chicagoDataService, ModalService) {

    // initial data grab from server
    chicagoDataService.getData({searchText: $scope.searchText, page: $scope.page}).then((response) => {
        $scope.$parent.data = response.data;
        $scope.$parent.hasMore = response.data.length < 15 ? false : true;
    });

    // TODO: refactor, this can probably be done in the template
    /**
     * used by prev button show/hide logic
     * @return {boolean}
     */
    $scope.onPageOne = function() {
        return $scope.page === 1;
    };

    /**
     * handleClick - function to handle click of list card
     * @param data - data of the list card that was clicked on
     */
    $scope.handleClick = function(data) {
        ModalService.showModal({
            templateUrl: '../templates/details-modal.html',
            controller: function() {
                this.data = data || {name: 'test'};
                this.violationCount = $scope.violationCount(data.inspection.violations);
                this.trimmedViolations = $scope.trimmedViolations(data.inspection.violations);
                this.url = $scope.url(data, "400x500");
                this.inspectionDate = moment(data.inspection.inspectionDate).format("L");
            },
            controllerAs: 'detailsModalController'
        }).then(function(modal) {
            modal.element.modal();
        });
    }

    // TODO: move this violation data alteration to the backend?
    /**
     *
     * @param violations - text block of violation count and violation list
     * @return {string | a number of violations or 0}
     */
    $scope.violationCount = function(violations) {
        return violations.substr(0, violations.indexOf('.')) || '0';
    };

    /**
     *
     * @param violations - text block of violation count and violation list
     * @return {string | violation list without the count}
     */
    $scope.trimmedViolations = function(violations) {
        return violations.substr(violations.indexOf(' ')) || 'No Violations Found';
    };

    /**
     *
     * @param data - data of list card, used for address
     * @param size - size of street view image to query
     * @return {string} - img url for google streetview api
     */
    $scope.url = function(data, size="300x275") {
        if (data.locationData.address) {
            const addressUri = encodeURIComponent(data.locationData.address);
            return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${addressUri}&fov=90&heading=235&pitch=10&key=${gooleApiKey}`;
        }
    };
}]);