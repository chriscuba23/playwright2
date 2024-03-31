// ANCHOR Importing necessary libraries and modules

const { faker } = require('@faker-js/faker');
const { chromium } = require('playwright');
const { test } = require('@playwright/test');
const SearchFlight = require('./search_flight_page');

let origin = 'ATH' //faker.airline.airport().iataCode
let destination = 'IST' //faker.airline.airport().iataCode
let tripType = 'oneWay' // NOTE could be 'return', 'oneWay', 'multiStop'
let cabinClass = 'First' // NOTE could be 'Economy', 'Premium', 'Business', 'First'
let availableAirlines 

// ANCHOR Generating flight data using faker library

test('Search Flight and filter with Number of Stops', async ({ page }) => {

    const searchFlight = new SearchFlight(page);
    await searchFlight.open();
    await searchFlight.searchForFlights(tripType, origin, destination, 2, 2, 1, cabinClass, false);
    await searchFlight.filterFlightsWithNumberOfStops();
});

test.only('Search Flight and filter with Airlines', async ({ page }) => {

    const searchFlight = new SearchFlight(page);
    await searchFlight.open();
    availableAirlines = await searchFlight.searchForFlights(tripType, origin, destination, 2, 2, 1, cabinClass, false);
    console.log(availableAirlines)
    await searchFlight.filterFlightsWithAirlines(availableAirlines[0]);
});

test.afterAll(async () => {
    const browser = await chromium.launch();
    await browser.close();

});