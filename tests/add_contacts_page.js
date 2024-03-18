const { test, expect } = require('@playwright/test');

class AddContactsPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/addContact');
    await expect(this.page).toHaveTitle(/Add Contact/);
    await expect(this.page.locator('h1')).toHaveText('Add Contact');
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');
  }

  async addNewContact(dataArray) {

    const locatorsArray = ['First Name', 'Last Name', 'yyyy-MM-dd', 'example@email.com', '8005551234', 'Address 1', 'Address 2', 'City', 'State or Province', 'Postal Code', 'Country']

    await expect(this.page).toHaveTitle(/Add Contact/);
    await expect(this.page.locator('h1')).toHaveText('Add Contact');
    await expect(this.page.getByRole('button', { name: 'Logout' })).toBeAttached()
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeAttached()
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeAttached()

    for (let i = 0; i < dataArray.length; i++) {

      await this.page.getByPlaceholder(locatorsArray[i]).fill(dataArray[i])

    }

  }

  async submitNewContact(isSuccessful) {

    await this.page.getByRole('button', { name: 'Submit' }).click();

    if (isSuccessful) {

      await expect(this.page.getByText('Contact validation failed')).not.toBeAttached();
      await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
    }

    else {

      await expect(this.page.getByText('Contact validation failed')).toBeAttached();
      await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');

    }

  }

  async clickLogoutButton() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.page).toHaveTitle(/Contact List App/);
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com');

  }

  async cancelAddContactForm() {

    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');

  }

}

module.exports = AddContactsPage;
