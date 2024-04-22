import { Given, Then } from '@cucumber/cucumber';
import request from 'supertest';
import configs from '../support/configs.js';
import { assert } from 'chai';

var resultFromAPI

Given('I {string} all the Brands', async function(APIEndpoint){
    switch(APIEndpoint){
        case "get":
            resultFromAPI = await request(configs.BaseURL).get('/brandsList')
            break
        case "update":
            resultFromAPI = await request(configs.BaseURL).put('/brandsList')
            break
        default :
            throw new Error("Incorrect APIEndpoint " + APIEndpoint)         
    }
})


Then('I should {string} the Brands', async function(APIStatus){

    var  parsedJSONAPIResult = JSON.parse(resultFromAPI.text)

    switch(APIStatus){
        case "be allowed to see":
            assert.equal(parsedJSONAPIResult.responseCode, 200)

            for (var index = 0; index < parsedJSONAPIResult.brands.length; index++) {
                assert.notEqual(parsedJSONAPIResult.brands[index].id, null);
                assert.notEqual(parsedJSONAPIResult.brands[index].brand, null);
            }
            break
        case "not be allowed to update":
            assert.equal(parsedJSONAPIResult.responseCode, 405)
            assert.equal(parsedJSONAPIResult.message, "This request method is not supported.");
            break
        default :
            throw new Error("Incorrect APIStatus " + APIStatus)         
    }
})
