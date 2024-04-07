const { test, expect } = require('@playwright/test'); // Importing test and expect functions from Playwright

class CurriculumPage {
  constructor(page) {
    this.page = page; // Initializing the page object
  }

  // Method to find the Free/Demo curriculum
  async findFreeDemoCurriculum() {
    // Locating necessary elements
    let filterButton = this.page.locator('form').getByRole('button');
    let demoCheckbox = this.page.getByLabel('Demo');
    let showResultsButton = this.page.getByRole('button', { name: 'Show results' });
    let clearAllFiltersButton = this.page.getByRole('button', { name: 'Clear all filters' });

    // Navigating to the curriculum page and applying filters
    await this.page.goto('https://staging.app.morphoses.io/en/curricula');
    await filterButton.click();
    await demoCheckbox.click();
    await expect(demoCheckbox).toBeChecked(); // Asserting that the Demo checkbox is checked
    await showResultsButton.click(); // Clicking on the Show results button
    await expect(clearAllFiltersButton).toBeAttached(); // Asserting that the Clear all filters button is attached
  }

  // Method to enroll in a class. Arguments are the kid's name and the index of the enrolling class so as to use it for the nth frame locator to choose between curricula
  async enrollInClass(learnerName, curriculaNth) {
    // Locating necessary elements
    let curriculaLinks = this.page.getByRole('link', { name: 'Free' });
    let enrollButtonsOnCards = this.page.locator('cmp-card').getByRole('button').filter({ hasText: 'Enroll' });
    let enrollButtonOnModal = this.page.getByRole('button', { name: 'Enroll' });
    let learnerCheckbox = this.page.getByLabel(learnerName);
    let viewClassroomPageButton = this.page.getByRole('link', { name: 'View classroom page' });
    let showLearnersButton = this.page.locator('.cursor-pointer > svg');
    let classLearnersModal = this.page.getByLabel('Class learner');
    let modalCloseButton = this.page.getByRole('button');

    // Enrolling in the specified class
    await curriculaLinks.nth(curriculaNth).click();
    await enrollButtonsOnCards.nth(0).click();
    await learnerCheckbox.click();
    await expect(learnerCheckbox).toBeChecked(); // Asserting that the learner checkbox is checked
    await enrollButtonOnModal.click();
    await viewClassroomPageButton.click();
    await showLearnersButton.click();
    await expect(classLearnersModal.getByText(learnerName)).toBeAttached(); // Asserting that the learner is attached
    await modalCloseButton.click();
    await expect(classLearnersModal).not.toBeAttached(); // Asserting that the learner is not attached

  }

  // Method to unenroll a class
  async unenrollClass(learnerName) {

    // Locating necessary elements

    let showLearnersButton = this.page.locator('.cursor-pointer > svg');
    let classLearnersModal = this.page.getByLabel('Class learner');
    let modalCloseButton = this.page.getByRole('button');
    let unenrollButton = this.page.getByRole('button', { name: 'Unenroll' });
    let unenrollButtonOnModal = this.page.getByLabel('Unenroll from the class').getByRole('button', { name: 'Unenroll' });
    let reasonForUnenrollDropDownButton = this.page.locator('div').filter({ hasText: /^Select the reason for unenrollment$/ }).first();
    let unenrollOption = this.page.getByRole('option', { name: 'I wish to enroll in another' });
    let snackbar = this.page.getByText('Successfully withdrawn from the class');

    const unenrollButtonHover = await unenrollButton.boundingBox(); // Getting coordinates of the unenroll button in order to hover in the center

    // Hovering and clicking on unenroll button
    await this.page.mouse.move(unenrollButtonHover.x + unenrollButtonHover.width / 2, unenrollButtonHover.y + unenrollButtonHover.height / 2); // hover in the center
    await this.page.mouse.click(unenrollButtonHover.x + unenrollButtonHover.width / 2, unenrollButtonHover.y + unenrollButtonHover.height / 2); // click on it

    await reasonForUnenrollDropDownButton.click();
    await unenrollOption.click();
    await expect(unenrollOption).not.toBeVisible(); // Asserting that the unenroll option is not visible
    await this.page.waitForTimeout(1000);
    await unenrollButtonOnModal.click();
    await expect(snackbar).toBeAttached(); // Asserting that the snackbar is attached
    await expect(snackbar).not.toBeAttached(); // Asserting that the snackbar is not attached
    await showLearnersButton.click();
    await expect(classLearnersModal.getByText(learnerName)).not.toBeAttached(); // Asserting that the learner is not attached
    await modalCloseButton.click();
    await expect(classLearnersModal).not.toBeAttached(); // Asserting that the learner is not attached
  }

  // Method to attempt to enroll in a non-available class
  async enrollInNonAvailableClass(learnerName, curriculaNth) {
    // Locating necessary elements
    let curriculaLinks = this.page.getByRole('link', { name: 'Free' });
    let enrollButtonsOnCards = this.page.locator('cmp-card').getByRole('button').filter({ hasText: 'Enroll' });
    let learnerCheckboxDisabled = this.page.locator('input[disabled][id] + label div span span').getByText(learnerName);
    let infoButton = this.page.locator('label path').first();
    let message = this.page.getByText('Does not meet the required age criteria to join this class');

    // Attempting to enroll in the non-available class
    await curriculaLinks.nth(curriculaNth).click();
    await enrollButtonsOnCards.nth(0).click();

    await this.page.waitForTimeout(1000);

    const infoButtonHover = await infoButton.boundingBox();

    // Hovering on info button

    await this.page.mouse.move(infoButtonHover.x + infoButtonHover.width / 2, infoButtonHover.y + infoButtonHover.height / 2);

    await expect(message).toBeAttached(); // Asserting that the message is attached
    await expect(learnerCheckboxDisabled).toBeAttached(); // Asserting that the learner checkbox is attached
  }
}

module.exports = CurriculumPage; // Exporting CurriculumPage class
