const express = require('express');
const path = require('path');
const axios = require('axios');
const Fuse = require('fuse.js');
const NodeCache = require( "node-cache" );


const getSearchOptions = function(options) {

    // handle nested key
    if (options.keywords.indexOf('results') !== -1) {
        options.keywords.splice(options.keywords.indexOf('results'), 1, 'inspection.results');
    }
    return {
        shouldSort: true,
        threshold: 0,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: options.keywords
    };
};

const mapChicagoApiData = function(data) {
    const mappedData = data.map((value) => {
        return {
            name: value['aka_name'],
            type: value.facility_type,
            locationData: {
                address: value.address || '',
                city: value.city || '',
                state: value.state || '',
                zip: value.zip || '',
                location: value.location || {},
            },
            inspection: {
                inspectionDate: value.inspection_date,
                inspectionId: value.inspection_id,
                inspectionType: value.inspection_type,
                results: value.results,
                risk: value.risk,
                violations: value.violations || ''
            }
        };
    });
    return mappedData;
}

const app = express();

const dataCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/chicago-data', function(req, res) {
    const url = 'https://data.cityofchicago.org/resource/cwig-ma7x.json';
    let filteredData;
    const searchText = req.query.searchQuery;
    const page = req.query.page;
    const keywords = req.query.keywords || 'name,type,results';
    dataCache.get( url, function( err, value ){
        if( !err ){
            if(value == undefined){
                axios.get(url).then((response) => {
                    filteredData = mapChicagoApiData(response.data);
                    dataCache.set( url, filteredData, function( err, success ){
                    });
                    const dataToSend = filteredData.slice(Number((page-1)*15), ((page-1)*15+15));
                    res.send(dataToSend);
                }).catch((e) => {
                    res.send([]);
                });
            } else {
                filteredData = value;
                console.log('getting data from cache');
                if (searchText) {
                    var dataFuse = new Fuse(value, getSearchOptions({keywords: keywords.split(",")}));
                    filteredData = dataFuse.search(searchText);
                }
                const dataToSend = filteredData.slice(Number((page-1)*15), ((page-1)*15+15));

                res.send(dataToSend);
            }
            delete dataFuse;

        }
    });
});

app.use(express.static('dist'));

app.listen(8080);