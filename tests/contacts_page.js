const { test, expect } = require('@playwright/test');

class ContactsPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/contactList');
    await expect(this.page).toHaveTitle(/My Contacts/);
    await expect(this.page.locator('h1')).toHaveText('Contact List');
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');

  }

  async assertContactsPage() {
    await expect(this.page).toHaveTitle(/My Contacts/);
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
    await expect(this.page.locator('h1')).toHaveText('Contact List');
    await expect(this.page.getByRole('button', { name: 'Logout' })).toBeAttached()
    await expect(this.page.getByRole('button', { name: 'Add a New Contact' })).toBeAttached()
    await expect(this.page.locator('div.contacts')).toBeVisible();

  }
  async clickLogoutButton() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.page).toHaveTitle(/Contact List App/);
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com');
  }

  async clickAddANewContact() {
    await this.page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(this.page).toHaveTitle(/Add Contact/);
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');
  }
  
  async verifyContactRow(dataArray) {
    await expect(this.page.locator('h1')).toHaveText('Contact List');

    for (let i = 0; i < dataArray.length; i++) {
      await expect(this.page.getByText(dataArray[i], { exact: false })).toBeVisible();
    }

  }
}

module.exports = ContactsPage;
