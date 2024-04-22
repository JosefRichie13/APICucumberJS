import { Given, Then } from '@cucumber/cucumber';
import request from 'supertest';
import configs from '../support/configs.js';
import { expect, assert } from 'chai';

var resultFromAPI
var searchParamFromTable

Given('I {string} all the Products', async function(APIEndpoint){
    switch(APIEndpoint){
        case "get":
            resultFromAPI = await request(configs.BaseURL).get('/productsList')
            break
        case "update":
            resultFromAPI = await request(configs.BaseURL).post('/productsList')
            break
        default :
            throw new Error("Incorrect APIEndpoint " + APIEndpoint)         
    }
})


Then('I should {string} the products', async function(APIStatus){

    var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)

    switch(APIStatus){
        case "be allowed to see":
            for (var index = 0; index < parsedJSONAPIResult.products.length; index++) {
                assert.notEqual(parsedJSONAPIResult.products[index].id, null);
                assert.notEqual(parsedJSONAPIResult.products[index].name, null);
                assert.notEqual(parsedJSONAPIResult.products[index].price, null);
                assert.notEqual(parsedJSONAPIResult.products[index].brand, null);
                assert.notEqual(parsedJSONAPIResult.products[index].category, null);
            }
            assert.equal(parsedJSONAPIResult.responseCode, 200)       
            break
        case "not be allowed to update":
            assert.equal(parsedJSONAPIResult.message, "This request method is not supported.");            
            assert.equal(parsedJSONAPIResult.responseCode, 405)         
            break
        default :
            throw new Error("Incorrect APIStatus " + APIStatus)         
    }
})


Given('I search for a product using', async function(table){

    searchParamFromTable = table.hashes()[0]['search_product']

    // If the search param's length is 0, we are not searching using the search_product search param
    // or else, we get it from the BDD and add it
    if (searchParamFromTable.length == 0){
        resultFromAPI = await request(configs.BaseURL).post('/searchProduct')
    }
    else {
        resultFromAPI = await request(configs.BaseURL).post('/searchProduct').field('search_product', searchParamFromTable)
    }
})


Then('I should {string} the product search result', async function(APIStatus){

    var  parsedJSONAPIResult = JSON.parse(resultFromAPI.text)

    switch(APIStatus){
        case "get":
            for (var index = 0; index < parsedJSONAPIResult.products.length; index++) {
                assert.notEqual(parsedJSONAPIResult.products[index].id, null);
                expect(parsedJSONAPIResult.products[index].name).to.contain(searchParamFromTable) 
                assert.notEqual(parsedJSONAPIResult.products[index].price, null);
                assert.notEqual(parsedJSONAPIResult.products[index].brand, null);
                assert.notEqual(parsedJSONAPIResult.products[index].category, null);
            }
            assert.equal(parsedJSONAPIResult.responseCode, 200)            
            break
        case "not get":
            assert.equal(parsedJSONAPIResult.message, "Bad request, search_product parameter is missing in POST request.");
            assert.equal(parsedJSONAPIResult.responseCode, 400)       
            break
        default :
            throw new Error("Incorrect APIStatus " + APIStatus)         
    }
})