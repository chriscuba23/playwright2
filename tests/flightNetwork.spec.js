// ANCHOR Importing necessary libraries and modules

const { faker } = require('@faker-js/faker');
const { chromium } = require('playwright');
const { test } = require('@playwright/test');
const SearchFlight = require('./search_flight_page');

// ANCHOR Generating flight data using faker library

test('Search Flight', async ({ page }) => {

    let origin = faker.airline.airport().iataCode
    let destination = faker.airline.airport().iataCode
    let tripType = 'oneWay' // NOTE could be 'return', 'oneWay', 'multiStop'
    let cabinClass = 'First' // NOTE could be 'Economy', 'Premium', 'Business', 'First'

    const searchFlight = new SearchFlight(page);
    await searchFlight.open();
    await searchFlight.searchForFlights(tripType, origin, destination, 2, 2, 1, cabinClass, false);

});

test.afterAll(async () => {
    const browser = await chromium.launch();
    await browser.close();

});