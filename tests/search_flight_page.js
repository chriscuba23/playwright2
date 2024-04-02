// This class represents functionalities related to searching for flights.

const { test, expect } = require('@playwright/test');

class SearchFlight {
  constructor(page) {
    this.page = page;
  }

  // Method to open the flight search page.
  async open() {
    // Locating the accept button for the cookie banner.
    let iAcceptButton = this.page.getByTestId('cookieBanner-confirmButton');

    // Navigating to the flight search page.
    await this.page.goto('https://www.flightnetwork.com/');
    // Expecting the title of the page to match the pattern for flight search.
    await expect(this.page).toHaveTitle(/Cheap Flights: Save up to 60% on Airline Tickets & Airfare | Flight Network/);
    // Expecting the heading of the page to contain specific text.
    await expect(this.page.locator('h1 > span')).toHaveText('The best airline tickets and airfares for cheap flights');
    // Clicking the accept button for the cookie banner.
    await iAcceptButton.click();
    // Expecting the accept button to be no longer attached after clicking.
    await expect(iAcceptButton).not.toBeAttached();
  }

  // Method to search for flights with specified parameters.
  async searchForFlights(tripType, origin, destination, numOfAdultPassengers, numOfChildPassengers, numOfInfantPassengers, cabinClass, hasNonStopFlights) {
    // Anchoring page selectors as variables for easy access.

    // Selecting trip type radio button.
    let tripTypeRadioButton = this.page.getByTestId(`searchForm-${tripType}-radio-label`);
    // Selecting input field for origin airport before clicking.
    let fromInputFieldBeforeClick = this.page.getByTestId('searchForm-singleBound-origin-input');
    // Selecting input field for origin airport after clicking.
    let fromInputFieldAfterClick = this.page.locator('input[id="searchForm-singleBound-origin-input"]');
    // Selecting input field for destination airport before clicking.
    let toInputFieldBeforeClick = this.page.getByTestId('searchForm-singleBound-destination-input');
    // Selecting input field for destination airport after clicking.
    let toInputFieldAfterClick = this.page.locator('input[id="searchForm-singleBound-destination-input"]');
    // Selecting option for origin airport.
    let originOption = this.page.getByTestId(`searchForm-LocationDropdownOption-${origin}`);
    // Selecting option for destination airport.
    let destinationOption = this.page.getByTestId(`searchForm-LocationDropdownOption-${destination}`);
    // Selecting passengers dropdown.
    let passengersSelect = this.page.getByTestId('searchForm-passengers-dropdown');
    // Selecting button to add adult passengers.
    let addAdultButton = this.page.getByTestId('adults-passengers-add');
    // Locator for the current value of adult passengers.
    let adultPassengerValue = this.page.locator('div[data-testid="adults-passengers-currentValue"]');
    // Selecting button to add child passengers.
    let addChildButton = this.page.getByTestId('children-passengers-add');
    // Locator for the current value of child passengers.
    let childPassengerValue = this.page.locator('div[data-testid="children-passengers-currentValue"]');
    // Selecting button to add infant passengers.
    let addInfantButton = this.page.getByTestId('infants-passengers-add');
    // Locator for the current value of infant passengers.
    let infantPassengerValue = this.page.locator('div[data-testid="infants-passengers-currentValue"]');
    // Locator for age options of children.
    let ageOfChildrenOptions = this.page.locator('div').filter({ hasText: /^Age, child 17$/ });
    // Selecting cabin class dropdown.
    let cabinClassSelect = this.page.getByTestId('searchForm-cabinClasses-dropdown');
    // Selecting option for cabin class.
    let cabinClassOption = this.page.getByRole('option', { name: `${cabinClass}` });
    // Selecting checkbox for non-stop flights.
    let nonStopFlightsCheckbox = this.page.getByTestId('directFlight-input');
    // Selecting button to search for flights.
    let searchFlightButton = this.page.getByTestId('searchForm-searchFlights-button');
    // Selecting button to toggle filters.
    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button');

    // Clicking the trip type radio button.
    await tripTypeRadioButton.click();
    // Expecting the trip type radio button to be checked.
    await expect(tripTypeRadioButton).toBeChecked();

    // Clicking the origin input field before filling it.
    await fromInputFieldBeforeClick.click();
    // Filtering input options before filling origin.
    await fromInputFieldBeforeClick.locator('div').filter({ hasText: 'Enter at least 2 characters' }).nth(3);
    // Filling the origin airport.
    await fromInputFieldAfterClick.fill(origin);
    // Selecting the origin airport from options.
    await originOption.first().click();

    // Clicking the destination input field before filling it.
    await toInputFieldBeforeClick.click();
    // Filtering input options before filling destination.
    await toInputFieldBeforeClick.locator('div').filter({ hasText: 'Enter at least 2 characters' }).nth(3);
    // Filling the destination airport.
    await toInputFieldAfterClick.fill(destination);
    // Selecting the destination airport from options.
    await destinationOption.first().click();

    // Clicking the passengers dropdown.
    await passengersSelect.click();

    // Adding adult passengers.
    for (let index = 0; index < numOfAdultPassengers - 1; index++) {
      await addAdultButton.click();
    }
    // Expecting the number of adult passengers to match the input.
    await expect(adultPassengerValue).toHaveText(String(numOfAdultPassengers));

    // Adding child passengers.
    for (let index = 0; index < numOfChildPassengers; index++) {
      await addChildButton.click();
    }
    // Expecting the number of child passengers to match the input.
    await expect(childPassengerValue).toHaveText(String(numOfChildPassengers));
    // Expecting the count of age options for children.
    await expect(ageOfChildrenOptions).toHaveCount(2);

    // Adding infant passengers.
    for (let index = 0; index < numOfInfantPassengers; index++) {
      await addInfantButton.click();
    }
    // Expecting the number of infant passengers to match the input.
    await expect(infantPassengerValue).toHaveText(String(numOfInfantPassengers));

    // Clicking the cabin class dropdown.
    await cabinClassSelect.click();
    // Selecting the specified cabin class option.
    await cabinClassOption.click();

    // Checking if non-stop flights checkbox is required.
    if (hasNonStopFlights) {
      // Expecting the non-stop flights checkbox not to be checked initially.
      await expect(nonStopFlightsCheckbox).not.toBeChecked();
      // Clicking the non-stop flights checkbox.
      await nonStopFlightsCheckbox.click();
      // Expecting the non-stop flights checkbox to be checked after clicking.
      await expect(nonStopFlightsCheckbox).toBeChecked();
    }

    // Clicking the button to search for flights.
    await searchFlightButton.click();
    // Waiting for the response containing flight search results.
    const responsePromise = await this.page.waitForResponse(response =>
      response.url().includes("/graphql/SearchOnResultPage") && response.status() === 200
    );
    // Parsing the response body as JSON.
    const responseBody = await responsePromise.json();

    // Expecting the search header button to contain the correct number of passengers.
    await expect(this.page.getByTestId('resultPage-searchHeaderButton-button')).toContainText(`${numOfAdultPassengers} adults, ${numOfChildPassengers + numOfInfantPassengers} children`);

    // Extracting airline names from the search result metadata and creating an array.
    let airlines = responseBody.data.search.resultSetMetaData.marketingCarriers.map(airline => airline.name);

    // Returning the array of airline names.
    return airlines;
  }

  // Method to filter flights by the number of stops.

  async filterFlightsByNumberOfStops() {
    // Selecting filter button.
    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button');
    // Selecting header for filtering flights.
    let filterByHeaderFlights = this.page.getByTestId('resultPage-filters-header');
    // Getting the total number of flights text.
    let totalFlightsText = await this.page.locator('span[data-testid="resultPage-filters-text"] + span').textContent();
    // Selecting button to reset all filters.
    let resetFilterAll = this.page.getByTestId('resultPage-filterHeader-allFilterResetButton-button');
    // Selecting indicator for selected filters.
    let selectedFilterIndicator = this.page.getByTestId('resultPage-filterHeader-selectedFiltersIndicator');

    // Selecting header for number of stops.
    let numberOfStopsHeader = this.page.getByTestId('resultPage-MAX_STOPS-header');
    // Selecting button for non-stop flights.
    let nonStopFlightsButton = this.page.getByTestId('MAX_STOPS-direct');
    // Selecting button for flights with maximum one stop.
    let maxOneStopButton = this.page.getByTestId('MAX_STOPS-max1');
    // Selecting button for all flights.
    let allButton = this.page.getByTestId('MAX_STOPS-all');
    // Selecting button to reset stop filter.
    let resetFilterStops = this.page.getByTestId('resultPage-filterHeader-MAX_STOPSFilterResetButton-button');

    // Expecting filter button to contain specific text.
    await expect(filterByButton).toContainText('Filter by');
    await filterByButton.click();
    // Expecting filter button to contain specific text after clicking.
    await expect(filterByButton).toContainText('Close');
    // Expecting header for number of stops to contain specific text.
    await expect(numberOfStopsHeader).toContainText('Number of stops');
    // Expecting non-stop flights button to contain specific text.
    await expect(nonStopFlightsButton).toContainText('Nonstop flights');
    // Expecting max one stop button to contain specific text.
    await expect(maxOneStopButton).toContainText('Maximum one stop');
    // Expecting all button to contain specific text.
    await expect(allButton).toContainText('All');
    // Expecting all button to have a specific class.
    await expect(allButton).toHaveClass(/selectedOption/);

    // Counting the number of segments with one stop.
    let segmentStopsCount = await this.page.getByTestId('searchResults-segment-stops').filter({ hasText: '1 stop' }).count();
    // Expecting the count of segments with one stop to be greater than or equal to zero.
    expect(parseInt(segmentStopsCount)).toBeGreaterThanOrEqual(0);

    // Clicking non-stop flights button.
    await nonStopFlightsButton.click();
    // Waiting for the response containing flight search results.
    const responsePromise = await this.page.waitForResponse((response) => response.url().includes("/graphql/SearchOnResultPage"));

    // Expecting non-stop flights button to have a specific class.
    await expect(nonStopFlightsButton).toHaveClass(/selectedOption/);
    // Expecting the selected filter indicator to contain specific text.
    await expect(selectedFilterIndicator).toContainText('Stops');
    // Expecting reset all filters button to contain specific text.
    await expect(resetFilterAll).toContainText('Reset filter');
    // Expecting reset stop filter button to contain specific text.
    await expect(resetFilterStops).toContainText('Reset filter');

    // Asserting the response status and body.
    const responseBody = await responsePromise.json();
    // Getting the count of filtered flights.
    let filteredFlightsCount = responseBody.data.search.filteredFlightsCount;
    // Expecting filter by header flights to contain specific text.
    await expect(filterByHeaderFlights).toContainText(`${filteredFlightsCount} of ${totalFlightsText.replace(': ', '').toLowerCase()}`);

    // Getting flights from the response.
    let flights = responseBody.data.search.flights;
    // Asserting that for non-stop flights, the segment length should be 1.
    flights.forEach(flight => {
      expect(flight).toHaveProperty('bounds[0].segments');
      let segments = flight.bounds[0].segments;
      expect(segments).toHaveLength(1);
    });

    // Expecting no segments with one stop to be found after filtering for non-stop flights.
    await expect(this.page.getByTestId('searchResults-segment-stops').filter({ hasText: '1 stop' })).toHaveCount(0);

    // Testing reset filters.
    await resetFilterStops.click();
    // Expecting filter by header flights to contain specific text after resetting filters.
    await expect(filterByHeaderFlights).toContainText(totalFlightsText);
    // Expecting all button to have a specific class after resetting filters.
    await expect(allButton).toHaveClass(/selectedOption/);
    // Expecting reset all filters button not to be attached after resetting filters.
    await expect(resetFilterAll).not.toBeAttached();
    // Expecting reset stop filter button not to be attached after resetting filters.
    await expect(resetFilterStops).not.toBeAttached();
    // Expecting selected filter indicator not to be attached after resetting filters.
    await expect(selectedFilterIndicator).not.toBeAttached();
  }

  // Method to filter flights by selected airlines.

  async filterFlightsByAirlines(airlines) {
    // Selecting filter button.
    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button');
    // Selecting header for filtering flights.
    let filterByHeaderFlights = this.page.getByTestId('resultPage-filters-header');
    // Getting the total number of flights text.
    let totalFlightsText = await this.page.locator('span[data-testid="resultPage-filters-text"] + span').textContent();
    // Selecting button to reset all filters.
    let resetFilterAll = this.page.getByTestId('resultPage-filterHeader-allFilterResetButton-button');
    // Selecting indicator for selected filters.
    let selectedFilterIndicator = this.page.getByTestId('resultPage-filterHeader-selectedFiltersIndicator');

    // Selecting header for airlines.
    let airlinesHeader = this.page.getByTestId('resultPage-AIRLINES-header');
    // Selecting button to clear all selections.
    let clearAllButton = this.page.getByRole('button', { name: 'Clear all' });
    // Selecting button to select all airlines.
    let selectAllButton = this.page.getByRole('button', { name: 'Select all' });
    // Selecting checkbox for the first airline in the list.
    let airlineCheckbox = this.page.locator(`li > label[title="${airlines[0]}"]`);

    // Selecting button to apply filters.
    let doneButton = this.page.getByTestId('filtersForm-applyFilters-button');
    // Selecting button to clear filters.
    let clearButton = this.page.getByTestId('filtersForm-resetFilters-button');
    // Selecting button to reset airline filter.
    let resetFilterAirlines = this.page.getByTestId('resultPage-filterHeader-AIRLINESFilterResetButton-button');

    // Expecting filter button to contain specific text.
    await expect(filterByButton).toContainText('Filter by');
    await filterByButton.click();
    // Expecting filter button to contain specific text after clicking.
    await expect(filterByButton).toContainText('Close');
    // Expecting airlines header to contain specific text.
    await expect(airlinesHeader).toContainText('Airlines');

    // Counting the number of results for the first airline.
    let airlineResultsCount = await this.page.locator(`div.css-akpcxl:has-text("${airlines[0]}")`).allTextContents();
    // Expecting the count of airline results to be greater than or equal to zero.
    expect(parseInt(airlineResultsCount.length)).toBeGreaterThanOrEqual(0);

    // Deselecting an airline checkbox.
    await airlineCheckbox.click();

    // Waiting for the response containing filtered airlines.
    const responsePromiseFilteredAirline = await this.page.waitForResponse((response) => response.url().includes("/graphql/SearchOnResultPage"));

    // Expecting the airline checkbox not to be checked.
    await expect(airlineCheckbox).not.toBeChecked();
    // Expecting the selected filter indicator to contain specific text.
    await expect(selectedFilterIndicator).toContainText('Airlines');
    // Expecting the reset all filters button to contain specific text.
    await expect(resetFilterAll).toContainText('Reset filter');
    // Expecting the reset airline filter button to contain specific text.
    await expect(resetFilterAirlines).toContainText('Reset filter');

    // Asserting the response status and body.
    const responseBodyFilteredAirline = await responsePromiseFilteredAirline.json();

    // Scrolling until the end of the page to load all flight results.
    await scrollUntilElementIsVisible(this.page, 'p:has-text("No more results.")');

    // Getting the count of filtered flights.
    let filteredFlightsCount = responseBodyFilteredAirline.data.search.filteredFlightsCount;
    // Expecting filter by header flights to contain specific text.
    await expect(filterByHeaderFlights).toContainText(`${filteredFlightsCount} of ${totalFlightsText.replace(': ', '').toLowerCase()}`);

    // Expecting no airline results to be found after deselecting an airline.
    await expect(this.page.locator(`div.css-akpcxl:has-text("${airlines[0]}")`)).toHaveCount(0);

    // Testing clear button.
    await clearButton.click();
    // Expecting the airline checkbox to be checked after clearing filters.
    await expect(airlineCheckbox).toBeChecked();
    // Expecting filter by header flights to contain specific text after clearing filters.
    await expect(filterByHeaderFlights).toContainText(totalFlightsText);
    // Expecting reset all filters button not to be attached after clearing filters.
    await expect(resetFilterAll).not.toBeAttached();
    // Expecting reset airline filter button not to be attached after clearing filters.
    await expect(resetFilterAirlines).not.toBeAttached();
    // Expecting selected filter indicator not to be attached after clearing filters.
    await expect(selectedFilterIndicator).not.toBeAttached();

    // Clicking clear all button.
    await clearAllButton.click();
    // Expecting reset airline filter button to be attached after clicking clear all button.
    await expect(resetFilterAirlines).toBeAttached();

    // Checking each airline checkbox.
    await airlines.forEach(async (airline) => {
      expect(this.page.getByLabel(`${airline}`)).not.toBeChecked();
    });

    // Clicking select all button.
    await selectAllButton.click();
    // Expecting reset airline filter button not to be attached after selecting all airlines.
    await expect(resetFilterAirlines).not.toBeAttached();

    // Checking each airline checkbox.
    await airlines.forEach(async (airline) => {
      if (!airlines[0]) {
        expect(this.page.getByLabel(`${airline}`)).toBeChecked();
      }
    });
  }
  // Method to filter flights by price range.

  async filterFlightsByPrice() {
    // Selecting filter button.
    let filterByButton = this.page.getByTestId('resultPage-toggleFiltersButton-button');
    // Selecting header for filtering flights.
    let filterByHeaderFlights = this.page.getByTestId('resultPage-filters-header');
    // Getting the total number of flights text.
    let totalFlightsText = await this.page.locator('span[data-testid="resultPage-filters-text"] + span').textContent();
    // Selecting button to reset all filters.
    let resetFilterAll = this.page.getByTestId('resultPage-filterHeader-allFilterResetButton-button');
    // Selecting button to reset price filter.
    let resetFilterPrice = this.page.getByTestId('resultPage-filterHeader-PRICEFilterResetButton-button');
    // Selecting indicator for selected filters.
    let selectedFilterIndicator = this.page.getByTestId('resultPage-filterHeader-selectedFiltersIndicator');

    // Selecting header for price.
    let priceHeader = this.page.getByTestId('resultPage-PRICE-header').getByText('Price');
    // Selecting slider handles for price range.
    let priceHandleFrom = this.page.getByTestId('resultPage-PRICEFilter-content').getByTestId('handle-0');
    let priceHandleTo = this.page.getByTestId('resultPage-PRICEFilter-content').getByTestId('handle-1');
    // Selecting slider track for price range.
    let priceSliderTrack = this.page.getByTestId('resultPage-PRICEFilter-content').getByTestId('track-0');
    // Selecting price range values.
    let priceFrom = await this.page.getByTestId('resultPage-PRICEFilter-content').locator('div.slider-tracks + div');
    let priceTo = await this.page.getByTestId('resultPage-PRICEFilter-content').locator('div.slider-tracks + div + div');

    // Getting starting price range values.
    let priceFromStartingValue = await priceFrom.textContent();
    let priceToStartingValue = await priceTo.textContent();

    // Selecting all prices.
    let allPrices = await this.page.getByTestId('result-trip-price-info-button');

    // Define the starting position of the From handle.
    const handleFromStartPosition = await priceHandleFrom.boundingBox();
    const startFromX = handleFromStartPosition.x + handleFromStartPosition.width / 2;
    const startFromY = handleFromStartPosition.y + handleFromStartPosition.height / 2;

    // Define the starting position of the To handle.
    const handleToStartPosition = await priceHandleTo.boundingBox();
    const startToX = handleToStartPosition.x + handleToStartPosition.width / 2;
    const startToY = handleToStartPosition.y + handleToStartPosition.height / 2;

    // Expecting filter button to contain specific text.
    await expect(filterByButton).toContainText('Filter by');
    await filterByButton.click();
    // Expecting filter button to contain specific text after clicking.
    await expect(filterByButton).toContainText('Close');
    // Expecting price header to contain specific text.
    await expect(priceHeader).toContainText('Price');

    // Mapping all prices array to replace non-digit characters.
    let allPricesArray = await this.page.getByTestId('result-trip-price-info-button').allTextContents();
    const allPricesArrayNew = await allPricesArray.map(replaceAllNonDigitChars);

    // Define the desired offset to drag the slider handle.
    const offsetFromX = 10;
    const offsetToX = -500;

    // Perform mouse interaction to drag the slider handles.
    await this.page.mouse.move(startFromX, startFromY);
    await this.page.mouse.down();
    await this.page.mouse.move(startFromX + offsetFromX, startFromY);
    await this.page.mouse.up();

    await this.page.mouse.move(startToX, startToY);
    await this.page.mouse.down();
    await this.page.mouse.move(startToX + offsetToX, startToY);
    await this.page.mouse.up();

    await priceHandleTo.click();

    // Waiting for the response containing filtered flights by price.
    const responsePromise = await this.page.waitForResponse((response) => response.url().includes("/graphql/SearchOnResultPage"));

    const responseBody = await responsePromise.json();

    let filteredFlightsCount = await responseBody.data.search.filteredFlightsCount;

    // Expecting filter by header flights to contain specific text.
    await expect(filterByHeaderFlights).toContainText(`${filteredFlightsCount} of ${totalFlightsText.replace(': ', '').toLowerCase()}`);
    // Expecting selected filter indicator to contain specific text.
    await expect(selectedFilterIndicator).toContainText('Price');
    // Expecting reset all filters button to contain specific text.
    await expect(resetFilterAll).toContainText('Reset filter');
    // Expecting reset price filter button to contain specific text.
    await expect(resetFilterPrice).toContainText('Reset filter');

    // Mapping filtered prices array to replace non-digit characters.
    let allPricesArrayFiltered = await this.page.getByTestId('result-trip-price-info-button').allTextContents();
    const allPricesArrayFilteredNew = await allPricesArrayFiltered.map(replaceAllNonDigitChars);

    // Expecting filtered prices array to be different from original prices array.
    expect(allPricesArrayNew.toString() == allPricesArrayFilteredNew.toString()).toBeFalsy();

    // Iterating over each price to ensure it falls within the selected price range.
    for (let i = 0; i < await allPrices.count(); i++) {
      expect(replaceAllNonDigitChars(await allPrices.nth(i).textContent())).toBeGreaterThanOrEqual(replaceAllNonDigitChars(await priceFrom.textContent()));
      expect(replaceAllNonDigitChars(await allPrices.nth(i).textContent())).toBeLessThanOrEqual(replaceAllNonDigitChars(await priceTo.textContent()));
    }

    // Test Reset filters.
    await resetFilterPrice.click();
    // Expecting filter by header flights to contain specific text after resetting price filter.
    await expect(filterByHeaderFlights).toContainText(totalFlightsText);
    // Expecting price from value to be the same as starting value after resetting price filter.
    await expect(priceFrom).toContainText(priceFromStartingValue);
    // Expecting price to value to be the same as starting value after resetting price filter.
    await expect(priceTo).toContainText(priceToStartingValue);
    // Expecting reset all filters button not to be attached after resetting price filter.
    await expect(resetFilterAll).not.toBeAttached();
    // Expecting reset price filter button not to be attached after resetting price filter.
    await expect(resetFilterPrice).not.toBeAttached();
    // Expecting selected filter indicator not to be attached after resetting price filter.
    await expect(selectedFilterIndicator).not.toBeAttached();

    // Mapping unfiltered prices array to replace non-digit characters.
    let allPricesArrayUnfiltered = await this.page.getByTestId('result-trip-price-info-button').allTextContents();
    const allPricesArrayUnfilteredNew = await allPricesArrayUnfiltered.map(replaceAllNonDigitChars);

    // Expecting unfiltered prices array to be the same as original prices array after resetting price filter.
    expect(allPricesArrayNew.toString() == allPricesArrayUnfilteredNew.toString()).toBeTruthy();

    // Iterating over each price to ensure it falls within the original price range after resetting price filter.
    for (let i = 0; i < await allPrices.count(); i++) {
      expect(replaceAllNonDigitChars(await allPrices.nth(i).textContent())).toBeGreaterThanOrEqual(replaceAllNonDigitChars(await priceFromStartingValue));
      expect(replaceAllNonDigitChars(await allPrices.nth(i).textContent())).toBeLessThanOrEqual(replaceAllNonDigitChars(await priceToStartingValue));
    }
  }
}

// Function to scroll until a specified element is visible on the page.
async function scrollUntilElementIsVisible(page, locator) {
  // Loop until the specified element becomes visible.
  while (!(await page.locator(locator).isVisible())) {
    // Scroll the page using mouse wheel.
    await page.mouse.wheel(0, 1000);
  }
}

// Function to replace all non-digit characters in a string with an empty string.
function replaceAllNonDigitChars(price) {
  // Replace all non-digit characters except for the decimal point.
  const strippedPrice = parseFloat(price.replace(/[^\d.]/g, ""));
  return strippedPrice;
}

// Exporting the SearchFlight class.
module.exports = SearchFlight;
