// Importing necessary libraries and modules
const { faker } = require('@faker-js/faker'); // Importing faker library
const { chromium } = require('playwright'); // Importing Chromium from Playwright
const { test } = require('@playwright/test'); // Importing test function from Playwright
const SearchFlight = require('./search_flight_page'); // Importing SearchFlight class from search_flight_page module

let browser; // Declare browser variable
let page; // Declare page variable
let searchFlight; // searchFlight instance

// Generating flight data using faker library or initializing hardcoded data
let origin = 'ATH'; // Origin airport code (Athens)
let destination = 'ARN'; // Destination airport code (Stockholm)

// initializing hardcoded data
let tripType = 'oneWay'; // Trip type (could be 'return', 'oneWay', 'multiStop')
let cabinClass = 'First'; // Cabin class (could be 'Economy', 'Premium', 'Business', 'First')

// Declare availableAirlines variable that will hold the airlines of the response

let availableAirlines;

test.beforeEach(async () => {
    // Launching Chromium browser and creating a new page
    browser = await chromium.launch();
    page = await browser.newPage();
    searchFlight = new SearchFlight(page); // Creating an instance of SearchFlight
    await searchFlight.open(); // Opening search flight page
    availableAirlines = await searchFlight.searchForFlights(tripType, origin, destination, 2, 2, 1, cabinClass, false); // Performing flight search
});

test('Search Flight and filter by Number of Stops', async () => {
    // Test to filter flights by number of stops
    await searchFlight.filterFlightsByNumberOfStops();
});

test('Search Flight and filter by Airlines', async () => {
    // Test to filter flights by airlines
    await searchFlight.filterFlightsByAirlines(availableAirlines);
});

test('Search Flight and filter by Price', async () => {
    // Test to filter flights by price
    await searchFlight.filterFlightsByPrice();
});

test.afterEach(async () => {
    // Closing the browser after each test
    await browser.close();
});

test.afterAll(async () => {
    // Closing the browser after all tests
    await browser.close();
});
