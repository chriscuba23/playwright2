const { test, expect } = require('@playwright/test');

class SearchFlight {
  constructor(page) {
    this.page = page;
  }


  async open() {
    await this.page.goto('https://www.flightnetwork.com/');
    await expect(this.page).toHaveTitle(/Cheap Flights: Save up to 60% on Airline Tickets & Airfare | Flight Network/);
    await expect(this.page.locator('h1 > span')).toHaveText('The best airline tickets and airfares for cheap flights');
  }

  async searchForFlights(tripType, origin, destination, numOfAdultPassengers, numOfChildPassengers, numOfInfantPassengers, cabinClass, hasNonStopFlights) {

    // ANCHOR page selectors as variables

    let tripTypeRadioButton = this.page.getByTestId(`searchForm-${tripType}-radio-label`)
    let fromInputFieldBeforeClick = this.page.getByTestId('searchForm-singleBound-origin-input')
    let fromInputFieldAfterClick = this.page.locator('input[id="searchForm-singleBound-origin-input"]')
    let toInputFieldBeforeClick = this.page.getByTestId('searchForm-singleBound-destination-input')
    let toInputFieldAfterClick = this.page.locator('input[id="searchForm-singleBound-destination-input"]')
    let originOption = this.page.getByTestId(`searchForm-LocationDropdownOption-${origin}`)
    let destinationOption = this.page.getByTestId(`searchForm-LocationDropdownOption-${destination}`)
    let passengersSelect = this.page.getByTestId('searchForm-passengers-dropdown')
    let addAdultButton = this.page.getByTestId('adults-passengers-add')
    let adultPassengerValue = this.page.locator('div[data-testid="adults-passengers-currentValue"]')
    let addChildButton = this.page.getByTestId('children-passengers-add')
    let childPassengerValue = this.page.locator('div[data-testid="children-passengers-currentValue"]')
    let addInfantButton = this.page.getByTestId('infants-passengers-add')
    let infantPassengerValue = this.page.locator('div[data-testid="infants-passengers-currentValue"]')
    let ageOfChildrenOptions = this.page.locator('div').filter({ hasText: /^Age, child 17$/ })
    let cabinClassSelect = this.page.getByTestId('searchForm-cabinClasses-dropdown')
    let cabinClassOption = this.page.getByRole('option', { name: `${cabinClass}` })
    let nonStopFlightsCheckbox = this.page.getByTestId('directFlight-input')
    let searchFlightButton = this.page.getByTestId('searchForm-searchFlights-button')
    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button')


    await tripTypeRadioButton.click()
    await expect(tripTypeRadioButton).toBeChecked();

    await fromInputFieldBeforeClick.click();
    await fromInputFieldBeforeClick.locator('div').filter({ hasText: 'Enter at least 2 characters' }).nth(3)
    await fromInputFieldAfterClick.fill(origin);
    await originOption.first().click()

    await toInputFieldBeforeClick.click();
    await toInputFieldBeforeClick.locator('div').filter({ hasText: 'Enter at least 2 characters' }).nth(3)
    await toInputFieldAfterClick.fill(destination);
    await destinationOption.first().click()

    await passengersSelect.click()

    for (let index = 0; index < numOfAdultPassengers - 1; index++) {
      await addAdultButton.click();
    }
    await expect(adultPassengerValue).toHaveText(String(numOfAdultPassengers))

    for (let index = 0; index < numOfChildPassengers; index++) {
      await addChildButton.click();
    }
    await expect(childPassengerValue).toHaveText(String(numOfChildPassengers))
    await expect(ageOfChildrenOptions).toHaveCount(2);

    for (let index = 0; index < numOfInfantPassengers; index++) {
      await addInfantButton.click();
    }
    await expect(infantPassengerValue).toHaveText(String(numOfInfantPassengers))

    await cabinClassSelect.click();
    await cabinClassOption.click();

    if (hasNonStopFlights) {

      await expect(nonStopFlightsCheckbox).not.toBeChecked()
      await nonStopFlightsCheckbox.click()
      await expect(nonStopFlightsCheckbox).toBeChecked()

    }

    await searchFlightButton.click()
    const responsePromise = await this.page.waitForResponse(response =>
      response.url().includes("/graphql/SearchOnResultPage") && response.status() === 200
    );
    const responseBody = await responsePromise.json();

    await expect(this.page.getByTestId('resultPage-searchHeaderButton-button')).toContainText(`${numOfAdultPassengers} adults, ${numOfChildPassengers + numOfInfantPassengers} children`)

    let airlines = responseBody.data.search.resultSetMetaData.marketingCarriers.map(airline => airline.name) // NOTE create an array with the airlines of the flight and return it

    return airlines

  }

  async filterFlightsWithNumberOfStops() {

    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button')
    let filterByHeaderFlights = this.page.getByTestId('resultPage-filters-header')
    let totalFlightsText = await this.page.locator('span[data-testid="resultPage-filters-text"] + span').textContent()
    let resetFilterAll = this.page.getByTestId('resultPage-filterHeader-allFilterResetButton-button')
    let selectedFilterIndicator = this.page.getByTestId('resultPage-filterHeader-selectedFiltersIndicator')

    let numberOfStopsHeader = this.page.getByTestId('resultPage-MAX_STOPS-header')
    let nonStopFlightsButton = this.page.getByTestId('MAX_STOPS-direct')
    let maxOneStopButton = this.page.getByTestId('MAX_STOPS-max1')
    let allButton = this.page.getByTestId('MAX_STOPS-all')
    let resetFilterStops = this.page.getByTestId('resultPage-filterHeader-MAX_STOPSFilterResetButton-button')

    await expect(filterByButton).toContainText('Filter by')
    await filterByButton.click()
    await expect(filterByButton).toContainText('Close')
    await expect(numberOfStopsHeader).toContainText('Number of stops')
    await expect(nonStopFlightsButton).toContainText('Nonstop flights')
    await expect(maxOneStopButton).toContainText('Maximum one stop')
    await expect(allButton).toContainText('All')
    await expect(allButton).toHaveClass(/selectedOption/);

    // click Nonstop flights

    await nonStopFlightsButton.click()

    const responsePromise = await this.page.waitForResponse((response) => response.url().includes("/graphql/SearchOnResultPage"));

    await expect(nonStopFlightsButton).toHaveClass(/selectedOption/);
    await expect(selectedFilterIndicator).toContainText('Stops')
    await expect(resetFilterAll).toContainText('Reset filter')
    await expect(resetFilterStops).toContainText('Reset filter')

    // Assert the response status and body
    const responseBody = await responsePromise.json();

    let filteredFlightsCount = responseBody.data.search.filteredFlightsCount

    await expect(filterByHeaderFlights).toContainText(`${filteredFlightsCount} of ${totalFlightsText.replace(': ', '').toLowerCase()}`)

    // NOTE flights response

    let flights = responseBody.data.search.flights

    // NOTE for non stop flights segment length should be 1

    flights.forEach(flight => {
      expect(flight).toHaveProperty('bounds[0].segments');
      let segments = flight.bounds[0].segments;
      expect(segments).toHaveLength(1);
    });

    // flights.forEach(flight => {
    //   expect(flight).toHaveProperty('bounds[0].segments');
    //   let segments = flight.bounds[0].segments;
    //   console.log(segments)
    //   let filteredSegments = segments.filter((segment) => segment.__typename === 'TripSegment')
    //   expect(filteredSegments).not.toBe.undefined;
    //   expect(filteredSegments.length).toBeLessThan(3)
    //   expect(filteredSegments.length).toBeGreaterThan(0)
    // });

    // NOTE test Reset filters

    await resetFilterStops.click()
    await expect(filterByHeaderFlights).toContainText(totalFlightsText)
    await expect(allButton).toHaveClass(/selectedOption/);

  }

  async filterFlightsWithAirlines(airline) {

    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button')
    let filterByHeaderFlights = this.page.getByTestId('resultPage-filters-header')
    let totalFlightsText = await this.page.locator('span[data-testid="resultPage-filters-text"] + span').textContent()
    let resetFilterAll = this.page.getByTestId('resultPage-filterHeader-allFilterResetButton-button')
    let selectedFilterIndicator = this.page.getByTestId('resultPage-filterHeader-selectedFiltersIndicator')

    let airlinesHeader = this.page.getByTestId('resultPage-AIRLINES-header')
    let clearAllButton = this.page.getByRole('button', { name: 'Clear all' })
    let selectAllButton = this.page.getByRole('button', { name: 'Select all' })
    let airlineCheckbox = this.page.locator(`li > label[title="${airline}"]`)

    let resetFilterAirlines = this.page.getByTestId('resultPage-filterHeader-AIRLINESFilterResetButton-button')

    await expect(filterByButton).toContainText('Filter by')
    await filterByButton.click()
    await expect(filterByButton).toContainText('Close')

    // deselect an Airline checkbox

    await airlineCheckbox.click()
    await expect(airlineCheckbox).not.toBeChecked()

    // NOTE scroll until you reach the end of the page and you thave no more infinite lazy loading, so as to grab the '/graphql/SearchMoreOnResultPage' calls as well

    await scrollUntilElementIsVisible(this.page, 'p:has-text("That\'s it!")')

    await this.page.pause()





    const responsePromise = await this.page.waitForResponse((response) => response.url().includes("/graphql/SearchOnResultPage"));



    // Assert the response status and body
    const responseBody = await responsePromise.json();

    let filteredFlightsCount = responseBody.data.search.filteredFlightsCount
    let flightsCount = responseBody.data.search.flightsCount

    await expect(filterByHeaderFlights).toContainText(`${filteredFlightsCount} of ${totalFlightsText.replace(': ', '').toLowerCase()}`)

    let displayedFlightsCount = Object.keys(responseBody.data.search.flights).length
    let priceRangeMin = responseBody.data.search.resultSetMetaData.priceRange.min
    let priceRangeMax = responseBody.data.search.resultSetMetaData.priceRange.max
    let travelTimeRangeMin = responseBody.data.search.resultSetMetaData.travelTimeRange.min
    let travelTimeRangeMax = responseBody.data.search.resultSetMetaData.travelTimeRange.max
    let marketingCarriersCount = Object.keys(responseBody.data.search.resultSetMetaData.marketingCarriers).length
    let flights = responseBody.data.search.flights

    console.log('Available airlines:\n')

    responseBody.data.search.resultSetMetaData.marketingCarriers.forEach(carrier => {
      console.log(carrier.name);
    });

    console.log('----------------------')

    console.log(`${displayedFlightsCount} displayed flights (${filteredFlightsCount} filtered / ${flightsCount} total):\n`)

    responseBody.data.search.flights.forEach(flight => {
      console.log(flight.bounds[0].segments[0].marketingCarrier.name);
    });

    console.log('Non stop flights: ----------------------')

    flights.forEach(flight => {
      expect(flight).toHaveProperty('bounds[0].segments');
      let segments = flight.bounds[0].segments;
      console.log(segments)
      expect(segments).toHaveLength(1);
    });

    // flights.forEach(flight => {
    //   expect(flight).toHaveProperty('bounds[0].segments');
    //   let segments = flight.bounds[0].segments;
    //   console.log(segments)
    //   let filteredSegments = segments.filter((segment) => segment.__typename === 'TripSegment')
    //   expect(filteredSegments).not.toBe.undefined;
    //   expect(filteredSegments.length).toBeLessThan(3)
    //   expect(filteredSegments.length).toBeGreaterThan(0)
    // });


    await resetFilterAirlines.click()
    await expect(filterByHeaderFlights).toContainText(totalFlightsText)
    await expect(allButton).toHaveClass(/selectedOption/);

  }

}

module.exports = SearchFlight;

async function scrollUntilElementIsVisible(page, locator) {
  while (!(await page.locator(locator).isVisible())) {
      await page.mouse.wheel(0, 100);
  }
}