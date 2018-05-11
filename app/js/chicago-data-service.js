/**
 * Service to get the chicago data from express server and pass query params
 */

// TODO: (enhancement) refactor this key to env variable then queried from express
const gooleApiKey = 'AIzaSyA5IGNDHog2WvQgwH0Qj-YlPbA_FS_q52k';

caseChekApp.service('chicagoDataService', function($http) {

    /**
     *
     * @param options - query param options for search and advanced search
     * @return {Promise} - returns http promise of chicago data
     */
    this.getData = function(options) {
        const params = options || {};
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
    }
});