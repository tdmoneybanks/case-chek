import sinon from 'sinon';
import chai from "chai";
import util from "../../util-functions";
import {dataToSearch, dataToMap,
    dataAfterMap, defaultMapData, resultsForStringJohn,
    searchOptionsObject, emptySearchOptionsObject } from '../mock_data/mock-data';

let searchedData = [],
    emptySearchedData = [];

describe('fuzzy search', function() {
    beforeEach(() => {
        sinon.spy(util, "getSearchOptions");
        searchedData = util.fuzzySearch(dataToSearch, 'john', 'title,author.firstName');
        emptySearchedData = util.fuzzySearch(dataToSearch, '', 'title,author.firstName');
    });

    afterEach(() => {
        util.getSearchOptions.restore();
    });
    describe('searching', function() {
        it('should find data', function() {
            chai.expect(emptySearchedData).to.be.instanceOf(Array);
            chai.expect(searchedData.length).to.not.equal(0);
        });

        it('should find correct data', function() {
            chai.expect(searchedData).to.deep.equal(resultsForStringJohn);
        });

        it('should not find data with no search text', function() {
            chai.expect(emptySearchedData).to.be.instanceOf(Array);
            chai.expect(emptySearchedData.length).to.equal(0);
        });

        describe('search options', function() {
            it('should call search options func once', function() {
                chai.expect(util.getSearchOptions.calledOnce);
            });

            it('should call search options with the right params', function() {
                chai.expect(util.getSearchOptions.calledWith({keywords: ['author.firstName', 'title']}));
            });

            it('should not call search option with the wrong params', function() {
                chai.expect(!util.getSearchOptions.calledWith('wrongType'));
            });
        });
    });
    describe('get search options function', function() {
        it('should return correct search options object', function() {
            const searchOptions = util.getSearchOptions({keywords: ['title']});
            chai.expect(searchOptions).to.deep.equal(searchOptionsObject);
        });
        it('should be able to accept string and array for keywords', function() {
            const searchOptionsOne = util.getSearchOptions({keywords: ['title']});
            const searchOptionsTwo = util.getSearchOptions({keywords: 'title'});
            chai.expect(searchOptionsOne).to.deep.equal(searchOptionsObject);
            chai.expect(searchOptionsTwo).to.deep.equal(searchOptionsObject);
        });
        it('should return an empty keyword array given an empty param', function() {
            const searchOptions = util.getSearchOptions();
            chai.expect(searchOptions).to.deep.equal(emptySearchOptionsObject);
        })
    });
    describe('mapping', function() {
        it('should map good data correctly', function() {
            const mappedData = util.mapChicagoApiData(dataToMap);
            chai.expect(mappedData).to.deep.equal(dataAfterMap);
        });

        it('should handle empty data with an empty array', function() {
            const mappedData = util.mapChicagoApiData();
            chai.expect(mappedData).to.be.instanceOf(Array);
            chai.expect(mappedData.length).to.equal(0);
        });

        it('should handle bad data with default values', function() {
            const mappedData = util.mapChicagoApiData(['test']);
            chai.expect(mappedData).to.deep.equal(defaultMapData);
        });
    });
});