import { Given, Then } from '@cucumber/cucumber';
import Ajv from "ajv"
import fs from 'node:fs/promises';
import { assert } from 'chai';

const ajv = new Ajv()

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
        default :
            throw new Error("Incorrect APIEndpoint " + APIEndpoint)         
    }
})
