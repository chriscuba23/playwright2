const { test, expect } = require('@playwright/test');

class RegistrationPage {
  constructor(page) {
    this.page = page;
  }

  async fillRegistrationForm(username, usersurname, email, password) {
    await expect(this.page.locator('h1')).toHaveText('Add User'); 
    await this.page.fill('input[id="firstName"]', username);
    await this.page.fill('input[id="lastName"]', usersurname);
    await this.page.fill('input[id="email"]', email);
    await this.page.fill('input[id="password"]', password);
  }

  async submitRegistrationForm() {

    await this.page.getByRole('button', { name: 'Submit' }).click();

  }

  async cancelRegistrationForm() {

    await this.page.getByRole('button', { name: 'Cancel' }).click();

  }

  async landsAtContactsPage() {
    await expect(this.page).toHaveTitle(/My Contacts/);
    await expect(this.page.locator('h1')).toHaveText('Contact List'); 
    await expect(this.page.getByRole('button', { name: 'Logout' })).toBeAttached()
    await expect(this.page.getByRole('button', { name: 'Add a New Contact' })).toBeAttached()
    await expect(this.page.locator('div.contacts')).toBeVisible(); 
    
  }
}

module.exports = RegistrationPage;
