caseChekApp.controller('ListController',['$scope', 'chicagoDataService', 'ModalService', function ListController($scope, chicagoDataService, ModalService) {

    chicagoDataService.getData({searchText: $scope.searchText, page: $scope.page}).then((response) => {
        $scope.$parent.data = response.data;
        $scope.$parent.hasMore = response.data.length < 15 ? false : true;
    });

    // TODO: refactor, this can probably be done in the template
    $scope.onPageOne = function() {
        return $scope.page === 1;
    };

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
    $scope.violationCount = function(violations) {
        return violations.substr(0, violations.indexOf('.')) || '0';
    };

    $scope.trimmedViolations = function(violations) {
        return violations.substr(violations.indexOf(' ')) || 'No Violations Found';
    };

    $scope.url = function(data, size="300x275") {
        if (data.locationData.address) {
            const addressUri = encodeURIComponent(data.locationData.address);
            return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${addressUri}&fov=90&heading=235&pitch=10&key=${gooleApiKey}`;
        }
    };
}]);