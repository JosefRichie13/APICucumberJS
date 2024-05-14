import { Given, Then } from '@cucumber/cucumber';
import Ajv from "ajv"
import fs from 'node:fs/promises';
import { assert } from 'chai';

const ajv = new Ajv()

// We validate the JSON Schema's using this method
// JSON Schema validation is one way of ensuring that the API's responses are consistent without any schema changes
// To do this, we need to create a Schema file for each API endpoint, e.g. BrandsAPI and store it in a JSON file, BrandsAPI_Schema.json
// We then make the API call to that endpoint, BrandsAPI and store the JSON response in a JSON file, BrandsAPI_data.json
// Finally we use the Ajv JSON schema validator to make sure that the JSON response has the same schema as the Schema file
// https://tryjsonschematypes.appspot.com/#validate, this website can help to write JSON Schemas

Then('I validate the {string} Schema to ensure that it is not changed', async function(APIEndpoint){
    switch(APIEndpoint){
        case "Brands API":
            const brandSchemaFromFile = await fs.readFile('./features/schemas/BrandsAPI_Schema.json', 'utf8', (err, data) => { });
            const brandDataFromFile = await fs.readFile('./features/schemas/BrandsAPI_Data.json', 'utf8', (err, data) => { });
            const validateBrandSchema = ajv.compile(JSON.parse(brandSchemaFromFile))
            const brandAPIStatus = validateBrandSchema(JSON.parse(brandDataFromFile))
            assert.equal(brandAPIStatus, true)
            break
        case "Products API":
            const productSchemaFromFile = await fs.readFile('./features/schemas/ProductsAPI_Schema.json', 'utf8', (err, data) => { });
            const productDataFromFile = await fs.readFile('./features/schemas/ProductsAPI_Data.json', 'utf8', (err, data) => { });
            const validateProductSchema = ajv.compile(JSON.parse(productSchemaFromFile))
            const productAPIStatus = validateProductSchema(JSON.parse(productDataFromFile))
            assert.equal(productAPIStatus, true)
            break
        case "User API":
            const userSchemaFromFile = await fs.readFile('./features/schemas/UserAPI_Schema.json', 'utf8', (err, data) => { });
            const userDataFromFile = await fs.readFile('./features/schemas/UserAPI_Data.json', 'utf8', (err, data) => { });
            const validateUserSchema = ajv.compile(JSON.parse(userSchemaFromFile))
            const userAPIStatus = validateUserSchema(JSON.parse(userDataFromFile))
            assert.equal(userAPIStatus, true)    
            break
        default :
            throw new Error("Incorrect APIEndpoint " + APIEndpoint)         
    }
})
