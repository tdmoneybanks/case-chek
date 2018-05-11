const express = require('express');
const path = require('path');
const axios = require('axios');
const Fuse = require('fuse.js');
const NodeCache = require( "node-cache" );
const util = require("./util-functions");

const app = express();

const dataCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

app.use(express.static('dist'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/chicago-data', function(req, res) {
    const url = 'https://data.cityofchicago.org/resource/cwig-ma7x.json';
    const searchText = req.query.searchQuery;
    const page = req.query.page;
    const keywords = req.query.keywords || 'name,type,results';
    dataCache.get( url, function( err, value ){
        if( !err ){
            if(value === undefined){
                axios.get(url).then((response) => {
                    const mappedData = util.mapChicagoApiData(response.data);
                    dataCache.set( url, mappedData, function( err, success ){
                    });
                    const dataToSend = mappedData.slice(Number((page-1)*15), ((page-1)*15+15));
                    res.send(dataToSend);
                }).catch((e) => {
                    res.send([]);
                });
            } else {
                // in production this would go to a logger not console log and would have a better structure
                console.log('getting data from cache');
                let filteredData = value;
                if (searchText) {
                    let dataFuse = new Fuse(value, util.getSearchOptions({keywords: keywords}));
                    filteredData = dataFuse.search(searchText);
                }
                const dataToSend = filteredData.slice(Number((page-1)*15), ((page-1)*15+15));

                res.send(dataToSend);
            }

        }
    });
});

app.listen(8080);
console.log('app listening at localhost:8080');