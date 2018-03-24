var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios');
const Fuse = require('fuse.js');
const util = require('util');
const NodeCache = require( "node-cache" );


const dataCache = new NodeCache();
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/chicago-data', function(req, res) {
    const url = 'https://data.cityofchicago.org/resource/cwig-ma7x.json';

    dataCache.get( url, function( err, value ){
        if( !err ){
            if(value == undefined){
                axios.get(url)
                    .then((response) => {
                    const mappedData = response.data.map((value) => {
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
                                risk: value.risk
                            }
                        };
                    });
                        const options = {
                            shouldSort: true,
                            threshold: 0,
                            location: 0,
                            distance: 100,
                            maxPatternLength: 32,
                            minMatchCharLength: 1,
                            keys: [{
                                name: 'name',
                                weight: 0.8
                            },
                                {
                                    name: 'type',
                                    weight: 0.2
                                }]
                        };
                        var dataFuse = new Fuse(mappedData, options);
                        const filteredData = dataFuse.search('MORDECAI BROWN');
                        dataCache.set( url, filteredData, function( err, success ){
                            if( !err && success ){
                                console.log( success );
                            }
                        });
                        res.send(filteredData);
                    });
            }else{
                console.log('getting data from cache');
                res.send(value);
            }
        }
    });
});

app.use(express.static('dist'));

app.listen(8080);