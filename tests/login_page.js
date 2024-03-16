const { test, expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
      this.page = page;
    }
  
    async open() {
      await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
      await expect(this.page).toHaveTitle(/Contact List App/);
      await expect(this.page.locator('h1')).toHaveText('Contact List App'); 
    }
  
    async clickRegisterButton() {
      await this.page.getByRole('button', { name: 'Sign up' }).click();
      await expect(this.page).toHaveTitle(/Add User/);
    }
  }
  
  module.exports = LoginPage;