import { Given, Then } from '@cucumber/cucumber';
import request from 'supertest';
import configs from '../support/configs.js';
import { expect } from 'chai';

var resultFromAPI

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
    switch(APIStatus){
        case "be allowed to see":
            expect(resultFromAPI.text).to.contain('products').and.to.contain('id').and.to.contain('name')
                .and.to.contain('price').and.to.contain('brand').and.to.contain('category');    
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


Given('I search for a product using', async function(table){

    const searchParamFromTable = table.hashes()[0]['search_product']

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
    switch(APIStatus){
        case "get":
            expect(resultFromAPI.text).to.contain('products').and.to.contain('id').and.to.contain('name')
                .and.to.contain('price').and.to.contain('brand').and.to.contain('category');    
            expect(resultFromAPI.text).to.contain("\"responseCode\": 200")             
            break
        case "not get":
            expect(resultFromAPI.text).to.contain("Bad request, search_product parameter is missing in POST request")
            expect(resultFromAPI.text).to.contain("\"responseCode\": 400")        
            break
        default :
            throw new Error("Incorrect APIStatus " + APIStatus)         
    }
})