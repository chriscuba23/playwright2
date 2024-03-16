// @ts-check
import { faker } from '@faker-js/faker';
const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
const LoginPage = require('./login_page');
const RegistrationPage = require('./registration_page');


let userName = faker.person.firstName()
let userSurname = faker.person.lastName()
let userEmail = faker.internet.email({ firstName: userName, lastName: userSurname })
let userPass = faker.internet.password()

test.beforeAll(async () => {
  const browser = await chromium.launch();
  await browser.newPage();

});

test('Open the login page and create account', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const registrationPage = new RegistrationPage(page);

  await loginPage.open();
  await loginPage.clickRegisterButton();
  await registrationPage.fillRegistrationForm(userName, userSurname, userEmail, userPass);
  await registrationPage.submitRegistrationForm();
  await registrationPage.landsAtContactsPage();

});

test.afterAll(async () => {
  const browser = await chromium.launch();
  await browser.close();

});