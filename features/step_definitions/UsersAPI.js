import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import { fakerDE as faker } from '@faker-js/faker';
import configs from '../support/configs.js';
import { expect } from 'chai';

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

    var resultFromAPI

    switch(UserStatus){
        case "does not exist":
            resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('email', generateRandomEmail()).field('password', generateRandomPassword())
            expect(resultFromAPI.text).to.contain("User not found!")
            expect(resultFromAPI.text).to.contain("404")
            console.log("Created email is " + generatedEmail)
            console.log("Created password is " + generatedPassword)
            break
        case "exists":
            resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('email', generatedEmail).field('password', generatedPassword)
            expect(resultFromAPI.text).to.contain("User exists!")
            expect(resultFromAPI.text).to.contain("200")
            break
        case "cannot be searched without email":
            resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('password', generatedPassword)
            expect(resultFromAPI.text).to.contain("Bad request, email or password parameter is missing in POST request")
            expect(resultFromAPI.text).to.contain("400")
            break
        case "cannot be deleted with the DELETE method":    
            resultFromAPI = await request(configs.BaseURL).delete('/verifyLogin').field('email', generatedEmail).field('password', generatedPassword)
            expect(resultFromAPI.text).to.contain("This request method is not supported")
            expect(resultFromAPI.text).to.contain("405")
            break
        case "cannot be searched with incorrect details":
            resultFromAPI = await request(configs.BaseURL).post('/verifyLogin').field('email', generatedEmail+generatedEmail).field('password', generatedPassword+generatedPassword)    
            expect(resultFromAPI.text).to.contain("User not found")
            expect(resultFromAPI.text).to.contain("404")
            break
        default :
            throw new Error("Incorrect UserStatus " + UserStatus)         
    }
})

When('I create a random user', async function(){

    generateRandomUserName()

    const resultFromAPI = await request(configs.BaseURL).post('/createAccount')
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

    expect(resultFromAPI.text).to.contain("User created!")
    expect(resultFromAPI.text).to.contain("201")

})

When('I update the random user', async function(){

    const resultFromAPI = await request(configs.BaseURL).put('/updateAccount')
        .field('email', generatedEmail)
        .field('password', generatedPassword)
        .field('country', "India")

    expect(resultFromAPI.text).to.contain("User updated!")   
    expect(resultFromAPI.text).to.contain("200")

})


When('I verify the user {string}', async function(UserAction){

    var resultFromAPI

    switch(UserAction){
        case "update":
            resultFromAPI = await request(configs.BaseURL).get('/getUserDetailByEmail?email='+generatedEmail)
            expect(resultFromAPI.text).to.contain("India") 
            expect(resultFromAPI.text).to.contain("200")
            break
        case "delete":
            resultFromAPI = await request(configs.BaseURL).get('/getUserDetailByEmail?email='+generatedEmail)
            expect(resultFromAPI.text).to.contain("Account not found with this email, try another email!")
            expect(resultFromAPI.text).to.contain("404")
            break
        default :
            throw new Error("Incorrect UserAction " + UserAction)          
    }
})


When('I delete a random user', async function(){

    const resultFromAPI = await request(configs.BaseURL).delete('/deleteAccount').field('email', generatedEmail).field('password', generatedPassword)
    expect(resultFromAPI.text).to.contain("Account deleted!")
    expect(resultFromAPI.text).to.contain("200")
    
})