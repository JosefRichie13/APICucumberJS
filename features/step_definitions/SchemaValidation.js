import { Given, Then } from '@cucumber/cucumber';
import Ajv from "ajv"
import fs from 'node:fs/promises';
import { assert } from 'chai';

const ajv = new Ajv()

Then('I validate the {string} Schema to ensure that it is not changed', async function(APIEndpoint){
    switch(APIEndpoint){
        case "Brands API":
            const schemaFromFile = await fs.readFile('./features/schemas/BrandsAPI_Schema.json', 'utf8', (err, data) => { });
            const dataFromFile = await fs.readFile('./features/schemas/BrandsAPI_Data.json', 'utf8', (err, data) => { });
            const validate = ajv.compile(JSON.parse(schemaFromFile))
            const status = validate(JSON.parse(dataFromFile))
            assert.equal(status, true)
        break
        default :
            throw new Error("Incorrect APIEndpoint " + APIEndpoint)         
    }
})
