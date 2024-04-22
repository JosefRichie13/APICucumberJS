import { Given, Then } from '@cucumber/cucumber';
import request from 'supertest';
import configs from '../support/configs.js';
import { expect } from 'chai';

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
    switch(APIStatus){
        case "be allowed to see":
            expect(resultFromAPI.text).to.contain('brands').and.to.contain('id').and.to.contain('brand')
            expect(resultFromAPI.text).to.contain("\"responseCode\": 200")          
            break
        case "not be allowed to update":
            expect(resultFromAPI.text).to.contain("This request method is not supported")
            expect(resultFromAPI.text).to.contain("\"responseCode\": 405")   
            break
        default :
            throw new Error("Incorrect APIStatus " + APIStatus)         
    }
})
