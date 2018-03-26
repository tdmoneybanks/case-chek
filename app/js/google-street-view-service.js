/**
 * This is currenly an un-used service. TODO enhancement would be to use this service to do error checking with api
 */
caseChekApp.service('googleStreetViewService', function($http) {

    /**
     *
     * @param location - address or set of lat/long coordinates
     * @return {Promise} - returns an http get promise
     */
    this.getData = function(location) {
        return $http({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${location}&fov=90&heading=235&pitch=10&key=${gooleApiKey}`,
            params: '',
            headers: {}
        });
    }
});