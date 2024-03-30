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

    const response = await this.page.waitForResponse((response) => response.url().includes("/SearchOnResultPage"));

    // Assert the response status and body
    const responseBody = await response.json();
   
    console.log(responseBody.data.search.flights)


  }

}

module.exports = SearchFlight;