// Importing necessary libraries and modules

const { faker } = require('@faker-js/faker');
const { chromium } = require('playwright');
const { test } = require('@playwright/test');
const LoginPage = require('./login_page');
const RegistrationPage = require('./registration_page');
const ContactsPage = require('./contacts_page');
const AddContactsPage = require('./add_contacts_page');

// Generating fake user data using faker library

let userName = faker.person.firstName()
let userSurname = faker.person.lastName()
let userEmail = faker.internet.email({ firstName: userName, lastName: userSurname })
let userPass = faker.internet.password()
let userEmailFalse = faker.internet.email() // for Negative email test
let userPassFalse = faker.internet.password() // for Negative password test

// Generating fake contact information using faker library

let contactFirstName = faker.person.firstName();
let contactLastName = faker.person.lastName();
let contactDateOfBirth = faker.date.past() // should stringify the output afterwards since we want a string, not an object
let contactEmail = faker.internet.email({ firstName: contactFirstName, lastName: contactLastName })
let contactPhone = faker.string.numeric({ length: 11 })
let contactPhone2 = '976.620.4768 x7104' // faker.phone.number() // FIXME number validation is not versatile. Has to accept greater string lengths and formats

// FIXME address has no validation in relativity. For example city and state/province may not match but still be accepted
// FIXME address data is not mandatory to be entered and does not throw an error if it dont

let contactAddress1 = faker.location.streetAddress();
let contactAddress2 = faker.location.secondaryAddress(); // FIXME secondaryAddress info not appearing at Contact List
let contactCity = faker.location.city();
let contactStateOrProvince = faker.location.state();
let contactPostalCode = faker.location.zipCode();
let contactCountry = faker.location.country();

// NOTE created two different datasets because some of the data that is sent upon Contact Creation is concatenated at the Contact List 

let contactArrayPost = [contactFirstName, contactLastName, (JSON.stringify(contactDateOfBirth)).substring(1, (JSON.stringify(contactDateOfBirth)).indexOf('T')), contactEmail, contactPhone, contactAddress1, contactAddress2, contactCity, contactStateOrProvince, contactPostalCode, contactCountry]
let contactArrayGet = [`${contactFirstName} ${contactLastName}`, (JSON.stringify(contactDateOfBirth)).substring(1, (JSON.stringify(contactDateOfBirth)).indexOf('T')), contactEmail, contactPhone, contactAddress1, `${contactCity} ${contactStateOrProvince} ${contactPostalCode}`, contactCountry]

test('Positive testing', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const registrationPage = new RegistrationPage(page);
  const contactsPage = new ContactsPage(page);
  const addContactsPage = new AddContactsPage(page);

  await loginPage.open();
  await loginPage.assertLoggedOut();
  await loginPage.clickRegisterButton();
  await registrationPage.fillRegistrationForm(userName, userSurname, userEmail, userPass);
  await registrationPage.submitRegistrationForm(true);
  await contactsPage.assertContactsPage();
  await contactsPage.clickLogoutButton();
  await loginPage.assertLoggedOut();
  await loginPage.logIn(userEmail, userPass, true);
  await contactsPage.clickAddANewContact();
  await addContactsPage.addNewContact(contactArrayPost)
  await addContactsPage.submitNewContact(true);
  await contactsPage.verifyContactRow(contactArrayGet)
  await contactsPage.clickLogoutButton()
  await loginPage.assertLoggedOut();
  
});

test('Negative testing', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const registrationPage = new RegistrationPage(page);
  const contactsPage = new ContactsPage(page);
  const addContactsPage = new AddContactsPage(page);
  const phoneIndex = contactArrayPost.indexOf(contactPhone);
  const emailIndex = contactArrayPost.indexOf(contactEmail);

  contactArrayPost.splice(phoneIndex, 1, contactPhone2); // replace contactPhone with contactPhone2 to explicitly cause a failure
  contactArrayPost.splice(emailIndex, 1, contactEmail.replace('@', '')) // remove @ sign from the email to explicitly cause a failure

  await loginPage.open();
  await loginPage.logIn(userEmailFalse, userPass, false);
  await loginPage.logIn(userEmail, userPassFalse, false);
  await loginPage.logIn(userEmailFalse, userPassFalse, false);
  await loginPage.clickRegisterButton();
  await registrationPage.fillRegistrationForm(userName, userSurname, userEmail, userPass);
  await registrationPage.submitRegistrationForm(false); // NOTE test if duplicate accounts cannot be created
  await registrationPage.cancelRegistrationForm()
  await loginPage.logIn(userEmail, userPass, true);
  await contactsPage.clickAddANewContact();
  await addContactsPage.addNewContact(contactArrayPost) // FIXME duplicate contacts can be created. Since this can indeed happen we should add the email as a unique identifier and warn the user
  await addContactsPage.submitNewContact(false) // NOTE submit Contact Creation form with erroneous data
  await addContactsPage.cancelAddContactForm()

});

// Closing the browser after all tests have finished running

test.afterAll(async () => {
  const browser = await chromium.launch();
  await browser.close();

});