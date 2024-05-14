import { Given, When } from '@cucumber/cucumber';
import request from 'supertest';
import { fakerDE as faker } from '@faker-js/faker';
import configs from '../support/configs.js';
import { assert } from 'chai';
import fs from 'fs';

// These variables hold the generated fake Email, Password and UserName
var generatedEmail
var generatedPassword
var generatedUserName

// Generates a fake email and stores it in the variable, generatedEmail
function generateRandomEmail(){
    return generatedEmail = faker.internet.email()
}

// Generates a fake password and stores it in the variable, generatedPassword
function generateRandomPassword(){
    return generatedPassword = faker.internet.password()
}

// Generates a fake username and stores it in the variable, generatedUserName
function generateRandomUserName(){
    return generatedUserName = faker.internet.userName()
}


Given('I verify that a random user {string}', async function(UserStatus){
    switch(UserStatus){
        case "does not exist":
            var resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('email', generateRandomEmail()).field('password', generateRandomPassword())
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            assert.equal(parsedJSONAPIResult.message, "User not found!");
            assert.equal(parsedJSONAPIResult.responseCode, 404)
            console.log("Created email is " + generatedEmail)
            console.log("Created password is " + generatedPassword)
            break
        case "exists":
            var resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('email', generatedEmail).field('password', generatedPassword)
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            assert.equal(parsedJSONAPIResult.message, "User exists!");
            assert.equal(parsedJSONAPIResult.responseCode, 200)    
            break
        case "cannot be searched without email":
            var resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('password', generatedPassword)
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            assert.equal(parsedJSONAPIResult.message, "Bad request, email or password parameter is missing in POST request.");
            assert.equal(parsedJSONAPIResult.responseCode, 400)      
            break
        case "cannot be deleted with the DELETE method":    
            var resultFromAPI = await request(configs.BaseURL).delete('/verifyLogin').field('email', generatedEmail).field('password', generatedPassword)
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            assert.equal(parsedJSONAPIResult.message, "This request method is not supported.");
            assert.equal(parsedJSONAPIResult.responseCode, 405)     
            break
        case "cannot be searched with incorrect details":
            var resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('email', generatedEmail+generatedEmail).field('password', generatedPassword+generatedPassword)    
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            assert.equal(parsedJSONAPIResult.message, "User not found!");
            assert.equal(parsedJSONAPIResult.responseCode, 404)  
            break
        default :
            throw new Error("Incorrect UserStatus " + UserStatus)         
    }
})

When('I create a random user', async function(){

    generateRandomUserName()

    var resultFromAPI = await request(configs.BaseURL).post('/createAccount')
        .field('name', generatedUserName)
        .field('email', generatedEmail)
        .field('password', generatedPassword)
        .field('title', "Mr")
        .field('birth_date', 4)
        .field('birth_month', 6)
        .field('birth_year', 2013)
        .field('firstname', generatedUserName)
        .field('lastname', generatedUserName)
        .field('company', generatedUserName)
        .field('address1', generatedUserName)
        .field('address2', generatedUserName)
        .field('country', "USA")
        .field('zipcode', generatedUserName)
        .field('state', generatedUserName)
        .field('city', generatedUserName)
        .field('mobile_number', generatedUserName)

    var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)    

    assert.equal(parsedJSONAPIResult.message, "User created!");
    assert.equal(parsedJSONAPIResult.responseCode, 201)

})

When('I update the random user', async function(){

    var resultFromAPI = await request(configs.BaseURL).put('/updateAccount')
        .field('email', generatedEmail)
        .field('password', generatedPassword)
        .field('country', "India")
    
    var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)    

    assert.equal(parsedJSONAPIResult.message, "User updated!");
    assert.equal(parsedJSONAPIResult.responseCode, 200)     

})


When('I verify the user {string}', async function(UserAction){
    switch(UserAction){
        case "update":
            var resultFromAPI = await request(configs.BaseURL).get('/getUserDetailByEmail?email='+generatedEmail)
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            fs.writeFile("./features/schemas/UserAPI_Data.json", JSON.stringify(parsedJSONAPIResult), (err) => { }) 
            assert.equal(parsedJSONAPIResult.user.country, "India");
            assert.equal(parsedJSONAPIResult.responseCode, 200)
            break
        case "delete":
            var resultFromAPI = await request(configs.BaseURL).get('/getUserDetailByEmail?email='+generatedEmail)
            var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
            assert.equal(parsedJSONAPIResult.message, "Account not found with this email, try another email!");
            assert.equal(parsedJSONAPIResult.responseCode, 404)
            break
        default :
            throw new Error("Incorrect UserAction " + UserAction)          
    }
})


When('I delete a random user', async function(){

    var resultFromAPI = await request(configs.BaseURL).delete('/deleteAccount').field('email', generatedEmail).field('password', generatedPassword)
    var parsedJSONAPIResult = JSON.parse(resultFromAPI.text)
    assert.equal(parsedJSONAPIResult.message, "Account deleted!");
    assert.equal(parsedJSONAPIResult.responseCode, 200)
    
})