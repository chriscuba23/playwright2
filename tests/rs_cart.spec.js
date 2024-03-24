
const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
const AddProductPage = require('./rs_add_prod_page');

let customerCountry = 'India'

let groceries = {
    'Brocolli': {
        price: 120,
        quantity: 20
    },
    'Cauliflower': {
        price: 60,
        quantity: 20
    },
    'Cucumber': {
        price: 48,
        quantity: 20
    },
    'Beetroot': {
        price: 32,
        quantity: 20
    }

}

let discount = {
    code: 'rahulshettyacademy',
    percentage: 10

}

let items = Object.keys(groceries).length


test.only('purchase test', async ({ page }) => {

    const addProductPage = new AddProductPage(page);

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/')

    await addProductPage.addProduct([Object.keys(groceries), Object.values(groceries)])
    await addProductPage.checkCartHeader(Object.values(groceries), items)
    await addProductPage.checkCart([Object.keys(groceries), Object.values(groceries)])
    await addProductPage.proceedToCheckout([Object.keys(groceries), Object.values(groceries)], discount)
    await addProductPage.placeOrder(customerCountry)

})