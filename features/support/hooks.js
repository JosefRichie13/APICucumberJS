import { Before, After } from '@cucumber/cucumber';

// Increases the default timeout to 1 min, default is 30 sec
import { setDefaultTimeout } from '@cucumber/cucumber';
setDefaultTimeout(60 * 1000);


Before(async function () {
    console.log("Executing Before Hook")
})


After(async function () {
    console.log("Executing After Hook")
})