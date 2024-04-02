const { test, expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
    await expect(this.page).toHaveTitle(/Contact List App/);
    await expect(this.page.locator('h1')).toHaveText('Contact List App');
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com');
  }

  async clickRegisterButton() {
    await this.page.getByRole('button', { name: 'Sign up' }).click();
    await expect(this.page).toHaveTitle(/Add User/);
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
  }

  async assertLoggedOut() {
    await expect(this.page).toHaveTitle(/Contact List App/);
    await expect(this.page.getByText('Logout')).not.toBeAttached();
    await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com');
  }

  async logIn(email, password, isSuccessful) {
    await this.page.fill('input[placeholder="Email"]', email);
    await this.page.fill('input[placeholder="Password"]', password);
    await this.page.getByRole('button', { name: 'Submit' }).click();

    if (isSuccessful) {
      await expect(this.page.getByText('Incorrect username or password')).not.toBeAttached();
      await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
    }

    else {
      await expect(this.page.getByText('Incorrect username or password')).toBeAttached();
      await expect(this.page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com');
    }

  }

}

module.exports = LoginPage;