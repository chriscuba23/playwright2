// Importing necessary libraries and modules
const { chromium } = require('playwright'); // Importing Chromium from Playwright
const { test } = require('@playwright/test'); // Importing test function from Playwright
const { faker } = require('@faker-js/faker');
const SearchFlight = require('./search_flight_page'); // Importing SearchFlight class from search_flight_page module
const FilterResults = require('./filter_results_page'); // Importing FilterResults class from filters_results_page module

let browser;
let page;
let searchFlight; // searchFlight instance
let filterResults; // filterResults instance

let origin = 'ATH'; // Origin airport code (Athens)
let destination = 'ARN'; // Destination airport code (Stockholm)

// NOTE we can try different origin and destination airports using a faker library but it may introduce flakyness
// let origin = faker.airline.airport().iataCode
// let destination = faker.airline.airport().iataCode

// declaring hardcoded-value variables
let tripType = 'oneWay';
let cabinClass = ['Economy', 'Premium', 'Business', 'First']; // later in the code we are going to get a random cabin class from the cabinClass array
let numOfPassengers = {adult: 2, child: 2, infant: 1}
let pixelsToDragPriceHandles = { min: 10, max: -500 }
let pixelsToDragTimeHandles = { max: -400 }

let availableAirlines; // Declaring variable that will hold the airlines of the response

test.beforeEach(async () => {
    // Launching Chromium browser and creating a new page
    browser = await chromium.launch();
    page = await browser.newPage();
    searchFlight = new SearchFlight(page); // Creating an instance of SearchFlight page
    filterResults = new FilterResults(page); // Creating an instance of Filter page
    await searchFlight.open(); // Opening search flight page
    availableAirlines = await searchFlight.searchForFlights(tripType, origin, destination, numOfPassengers.adult, numOfPassengers.child, numOfPassengers.infant, cabinClass[Math.floor(Math.random() * cabinClass.length)], false); // Performing flight search and assigning the airlines from the response to a variable
});

test('Search Flight and filter by Number of Stops', async () => {
    await filterResults.filterFlightsByNumberOfStops();
});

test('Search Flight and filter by Airlines', async () => {
    await filterResults.filterFlightsByAirlines(availableAirlines);
});

test('Search Flight and filter by Price', async () => {
    await filterResults.filterFlightsByPrice(pixelsToDragPriceHandles.min, pixelsToDragPriceHandles.max);
});

test('Search Flight and filter by Travel time', async () => {
    await filterResults.filterFlightsByTravelTime(pixelsToDragTimeHandles.max);
});

test.afterEach(async () => {
    await browser.close();
});

test.afterAll(async () => {
    await browser.close();
});
