const Fuse = require('fuse.js');

module.exports = {
    /**
     * get the search options for fuse
     * @param options - search query key words
     * @return {Object} - fuse search options based on search query
     */
    getSearchOptions: (options={}) => {
        //convert comma separated strings to arrays
        if (typeof options.keywords === 'string') {
            options.keywords = options.keywords.split(',');
        }
        // handle nested key
        if (options.keywords && options.keywords.indexOf('results') !== -1) {
            options.keywords.splice(options.keywords.indexOf('results'), 1, 'inspection.results');
        }
        return {
            shouldSort: true,
            threshold: 0,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: options.keywords || []
        };
    },

    /**
     *
     * @param data - the data set to search through
     * @param searchText - the value to search the data set for
     * @param keywords - the object keys to search through
     * @return {any[]} - return an array of the objects that match the search
     */
    fuzzySearch: function (data, searchText, keywords) {
        const searcher = new Fuse(data, this.getSearchOptions({keywords: keywords.split(",")}));
        return searcher.search(searchText);
    },

    /**
     * map chicago data to a better format
     * @param data - the data to map to the schema
     * @return {Object} - mapped chicago data
     */
    mapChicagoApiData: function(data) {
        if (!data) {
            console.log('entered here');
            console.log(data);
            return [];
        }
        return data.map((value) => {
            return {
                name: value['aka_name'] || '',
                type: value.facility_type || '',
                locationData: {
                    address: value.address || '',
                    city: value.city || '',
                    state: value.state || '',
                    zip: value.zip || '',
                    location: value.location || {},
                },
                inspection: {
                    inspectionDate: value.inspection_date || '',
                    inspectionId: value.inspection_id || '',
                    inspectionType: value.inspection_type || '',
                    results: value.results || '',
                    risk: value.risk || '',
                    violations: value.violations || ''
                }
            };
        });
    }
};