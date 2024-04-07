const { test, expect } = require('@playwright/test'); // Importing test and expect functions from Playwright

class LoginPage {
    constructor(page) {
        this.page = page; // Initializing the page object
    }

    // Method to open the login page
    async open() {
        
        await this.page.goto('https://staging.app.morphoses.io/en/register/login'); // Navigating to the login page
    }

    // Method to log in with provided credentials
    async login(email, password, name) {
        // Locating necessary elements
        let emailInput = this.page.locator('div').filter({ hasText: /^Email\*$/ }).locator('input');
        let passInput = this.page.locator('div').filter({ hasText: /^Password\*$/ }).locator('input');
        let rememberMeCheckbox = this.page.getByLabel('Remember me');
        let logInButton = this.page.getByRole('button', { name: 'Log in' });
        let greetingMessage = this.page.getByRole('heading');

        // Filling in email and password, checking the Remember me checkbox
        await emailInput.fill(email);
        await passInput.fill(password);
        await rememberMeCheckbox.click();
        await expect(rememberMeCheckbox).toBeChecked(); // Asserting that the Remember me checkbox is checked
        await expect(greetingMessage.nth(1)).toContainText(`Hello ${name} 👋`); // Asserting greeting message
        await logInButton.click(); // Clicking on the Log in button
        await expect(greetingMessage.nth(0)).toContainText(`Curricula`); // Asserting greeting message after login
    }
}

module.exports = LoginPage; // Exporting LoginPage class
