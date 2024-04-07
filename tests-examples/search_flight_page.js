// This class represents functionalities related to searching for flights

const { test, expect } = require('@playwright/test');
const moment = require('moment');

class SearchFlight {
  // Constructor to initialize the class with a page object
  constructor(page) {
    this.page = page;
  }

  // Method to open the flight search page
  async open() {

    let iAcceptButton = this.page.getByTestId('cookieBanner-confirmButton');

    await this.page.goto('https://www.flightnetwork.com/');
    await expect(this.page).toHaveTitle(/Cheap Flights: Save up to 60% on Airline Tickets & Airfare | Flight Network/);
    await expect(this.page.locator('h1 > span')).toHaveText('The best airline tickets and airfares for cheap flights');
    await iAcceptButton.click();
    await expect(iAcceptButton).not.toBeAttached();
  }

  // Method to search for flights with specified parameters
  async searchForFlights(tripType, origin, destination, numOfAdultPassengers, numOfChildPassengers, numOfInfantPassengers, cabinClass, hasNonStopFlights) {
    // Declaring page selectors as variables for easy access

    let departureDate = moment().add(1,'days')

    let tripTypeRadioButton = this.page.getByTestId(`searchForm-${tripType}-radio-label`);
    let departureDateInput = this.page.getByTestId('singleBound.departureDate-input')
    let calendar = this.page.locator('div.rdp-month')
    let calendarTodayDate = this.page.locator('button[name=day][class*="selected"]')

    // origin and destination input fields in before and after click states
    let fromInputFieldBeforeClick = this.page.getByTestId('searchForm-singleBound-origin-input');
    let fromInputFieldAfterClick = this.page.locator('input[id="searchForm-singleBound-origin-input"]');
    let toInputFieldBeforeClick = this.page.getByTestId('searchForm-singleBound-destination-input');
    let toInputFieldAfterClick = this.page.locator('input[id="searchForm-singleBound-destination-input"]');

    let originOption = this.page.getByTestId(`searchForm-LocationDropdownOption-${origin}`);
    let destinationOption = this.page.getByTestId(`searchForm-LocationDropdownOption-${destination}`);
    let passengersSelect = this.page.getByTestId('searchForm-passengers-dropdown');
    let addAdultButton = this.page.getByTestId('adults-passengers-add');
    let adultPassengerValue = this.page.locator('div[data-testid="adults-passengers-currentValue"]');
    let addChildButton = this.page.getByTestId('children-passengers-add');
    let childPassengerValue = this.page.locator('div[data-testid="children-passengers-currentValue"]');
    let addInfantButton = this.page.getByTestId('infants-passengers-add');
    let infantPassengerValue = this.page.locator('div[data-testid="infants-passengers-currentValue"]');
    let ageOfChildrenOptions = this.page.locator('div').filter({ hasText: /^Age, child 17$/ });
    let cabinClassSelect = this.page.getByTestId('searchForm-cabinClasses-dropdown');
    let cabinClassOption = this.page.getByRole('option', { name: `${cabinClass}` });
    let nonStopFlightsCheckbox = this.page.getByTestId('directFlight-input');
    let searchFlightButton = this.page.getByTestId('searchForm-searchFlights-button');
    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button');

    await expect(departureDateInput).not.toBeVisible();
    await expect(passengersSelect).not.toBeVisible();
    await expect(cabinClassSelect).not.toBeVisible();
    await expect(nonStopFlightsCheckbox).not.toBeVisible();

    await tripTypeRadioButton.click();
    await expect(tripTypeRadioButton).toBeChecked();

    await fromInputFieldBeforeClick.click();
    await fromInputFieldBeforeClick.locator('div').filter({ hasText: 'Enter at least 2 characters' }).nth(3);
    await fromInputFieldAfterClick.fill(origin);
    await originOption.first().click(); // Selecting the first option of origin airport results

    await toInputFieldBeforeClick.click();
    await toInputFieldBeforeClick.locator('div').filter({ hasText: 'Enter at least 2 characters' }).nth(3);
    await toInputFieldAfterClick.fill(destination);
    await destinationOption.first().click();

    await expect(departureDateInput).toHaveValue(departureDate.format('YYYY-MM-DD'));
    await departureDateInput.click()
    await expect(calendar).toContainText(departureDate.format('MMMM YYYY'))
    await expect(calendarTodayDate).toContainText(departureDate.format('D'))

    await passengersSelect.click();

    // Adding the passenger number
    for (let index = 0; index < numOfAdultPassengers - 1; index++) {
      await addAdultButton.click();
    }
    await expect(adultPassengerValue).toHaveText(String(numOfAdultPassengers));

    for (let index = 0; index < numOfChildPassengers; index++) {
      await addChildButton.click();
    }

    await expect(childPassengerValue).toHaveText(String(numOfChildPassengers));
    await expect(ageOfChildrenOptions).toHaveCount(2);

    for (let index = 0; index < numOfInfantPassengers; index++) {
      await addInfantButton.click();
    }
    await expect(infantPassengerValue).toHaveText(String(numOfInfantPassengers));


    await cabinClassSelect.click();
    await cabinClassOption.click();

    // Checking if non-stop flights checkbox is required to be clicked or not
    if (hasNonStopFlights) {
      await expect(nonStopFlightsCheckbox).not.toBeChecked();
      await nonStopFlightsCheckbox.click();
      await expect(nonStopFlightsCheckbox).toBeChecked();
    }

    // Clicking the button to search for flights
    await searchFlightButton.click();
    // Waiting for the response containing flight search results
    const responsePromise = await this.page.waitForResponse(response =>
      response.url().includes("/graphql/SearchOnResultPage") && response.status() === 200
    );
    // Parsing the response body as JSON
    const responseBody = await responsePromise.json();

    // Expecting the search header button to contain the correct number of passengers
    await expect(this.page.getByTestId('resultPage-searchHeaderButton-button')).toContainText(`${numOfAdultPassengers} adults, ${numOfChildPassengers + numOfInfantPassengers} children`);

    // Extracting airline names from the search result metadata and creating an airlines array
    let airlines = responseBody.data.search.resultSetMetaData.marketingCarriers.map(airline => airline.name);

    // Returning the array of airline names
    return airlines;
  }


}

// Exporting the SearchFlight class
module.exports = SearchFlight;
