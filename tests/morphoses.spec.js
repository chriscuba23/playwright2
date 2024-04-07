const { chromium } = require('playwright'); // Importing Chromium from Playwright
const { test } = require('@playwright/test'); // Importing test function from Playwright
const LoginPage = require('./login_page.js'); // Importing LoginPage class
const CurriculumPage = require('./curriculum_page.js'); // Importing CurriculumPage class

let loginPage;
let curriculumPage;
let browser; // Declaration of browser variable
let page; // Declaration of page variable
let email = 'chriscuba23@gmail.com';
let password = 'chriscuba23@gmail.co';
let name = 'Chris';
let kidName = 'Eve';
let curriculaArray = ['Οι Απίθανοι', 'Explore the world']; // Initializing curriculaArray variable with curriculum names

test.beforeEach(async () => {
    browser = await chromium.launch(); // Launching Chromium browser
    page = await browser.newPage(); // Opening a new browser page
    loginPage = new LoginPage(page); // Creating an instance of LoginPage
    curriculumPage = new CurriculumPage(page); // Creating an instance of CurriculumPage
    await loginPage.open(); // Opening the login page
    await loginPage.login(email, password, name); // Logging in with provided credentials
});

test.afterEach(async () => {
    await page.close(); // Closing the browser page after each test
});

test('Enroll a user\'s kid in a class of a free/demo curriculum', async () => {
    await curriculumPage.findFreeDemoCurriculum(); // Finding the free/demo curriculum
    await curriculumPage.enrollInClass(kidName, curriculaArray.indexOf('Οι Απίθανοι')); // Enrolling the user's kid in a specific class
    await curriculumPage.unenrollClass(kidName); // Unenrolling the user's kid from a class

});

test('Attempt to enroll in a non-available class', async () => {
    await curriculumPage.findFreeDemoCurriculum(); // Finding the free/demo curriculum
    await curriculumPage.enrollInNonAvailableClass(kidName, curriculaArray.indexOf('Explore the world')); // Attempting to enroll in a non-available class
});
