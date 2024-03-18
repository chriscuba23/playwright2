const { test, expect } = require('@playwright/test');

class RegistrationPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/addUser');
    await expect(this.page).toHaveTitle(/Add User/);
    await expect(this.page.locator('h1')).toHaveText('Add User');
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
  }

  async fillRegistrationForm(username, usersurname, email, password) {
    await expect(this.page.locator('h1')).toHaveText('Add User');
    await this.page.fill('input[id="firstName"]', username);
    await this.page.fill('input[id="lastName"]', usersurname);
    await this.page.fill('input[id="email"]', email);
    await this.page.fill('input[id="password"]', password);
  }

  async submitRegistrationForm(isSuccessful) {

    await this.page.getByRole('button', { name: 'Submit' }).click();

    if (isSuccessful) {

      await expect(this.page.getByText('Email address is already in use')).not.toBeAttached();
      await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
    }

    else {
      await expect(this.page.getByText('Email address is already in use')).toBeAttached();
      await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
    }


  }

  async cancelRegistrationForm() {

    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/login');

  }

}

module.exports = RegistrationPage;
