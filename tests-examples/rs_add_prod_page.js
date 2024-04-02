const { test, expect } = require('@playwright/test');

class AddProductPage {
  constructor(page) {
    this.page = page;
  }

  async addProduct(product) {

    for (let index = 0; index < product[1].length; index++) {

      let name = product[0][index]
      let price = product[1][index].price
      let quantity = product[1][index].quantity

      let regexAdd = new RegExp(`^${name} - 1 Kg${price}–\\+ADD TO CART$`)
      let regexAdded = new RegExp(`^${name} - 1 Kg${price}–\\+✔ ADDED$`)

      await expect(this.page.locator('div').filter({ hasText: regexAdd }).getByRole('button')).toHaveCSS('background', /rgb\(7, 121, 21\)/)
      for (let index = 1; index <= quantity; index++) {
        await this.page.locator('div').filter({ hasText: regexAdd }).getByRole('link').nth(1).click();
        await expect(this.page.locator('div').filter({ hasText: regexAdd }).getByRole('spinbutton')).toHaveValue(String(index + 1))
      }
      await this.page.locator('div').filter({ hasText: regexAdd }).getByRole('button').click();
      await this.page.locator('div').filter({ hasText: regexAdded }).isVisible()
      await expect(this.page.locator('div').filter({ hasText: regexAdded }).getByRole('button')).toHaveCSS('background', /rgb\(252, 119, 16\)/)
      await expect(this.page.locator('div').filter({ hasText: regexAdd }).getByRole('button')).toHaveCSS('background', /rgb\(10, 169, 29\)/)

      await expect(this.page.getByRole('row', { name: 'Items :' }).getByRole('strong')).toHaveText(String(index+1))
    }


  }

  async checkCartHeader(productValues, items) {

    var total = calculateTotalPrice(productValues)

    await expect(this.page.getByRole('row', { name: 'Price :' }).getByRole('strong')).toHaveText(String(total))
    await expect(this.page.getByRole('row', { name: 'Items :' }).getByRole('strong')).toHaveText(String(items))

  }

  async checkCart(product) {

    await this.page.getByRole('link', { name: 'Cart' }).click();

    for (let index = 0; index < product[1].length; index++) {

      await expect(this.page.locator('p.product-name').nth(index)).toHaveText(`${product[0][index]} - 1 Kg`)
      await expect(this.page.locator('p.product-price').nth(index)).toHaveText(String(product[1][index].price))
      await expect(this.page.locator('p.quantity').nth(index)).toContainText(String(product[1][index].quantity += 1))
      await expect(this.page.locator('p.amount').nth(index)).toContainText(String((product[1][index].quantity * product[1][index].price)))

    }

  }

  async proceedToCheckout(product, discount) {

    await this.page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
    let y = 0
    let z = 1
    for (let x = 0; x < product[1].length; x += 1) {

      await expect(this.page.locator('p.product-name').nth(x)).toHaveText(`${product[0][x]} - 1 Kg`)
      await expect(this.page.locator('p.quantity').nth(x)).toContainText(String(product[1][x].quantity))
      await expect(this.page.locator('p.amount').nth(x + y)).toContainText(String(product[1][x].price))
      await expect(this.page.locator('p.amount').nth(x + z)).toContainText(String(product[1][x].quantity * product[1][x].price))

      y += 1
      z += 1
    }

    await this.page.getByPlaceholder('Enter promo code').fill(discount.code);
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await expect(this.page.getByText('Code applied ..!')).toBeAttached();
    await expect(this.page.locator('span.discountPerc')).toContainText(`${String(discount.percentage)}%`)

    let total = parseInt(await this.page.locator('span.totAmt').textContent())

    await expect(this.page.locator('span.discountAmt')).toContainText(String((total) - (discount.percentage * (total) / 100)))

  }

  async placeOrder(customerCountry) {

    await this.page.getByRole('button', { name: 'Place Order' }).click();
    const countrySelectList = this.page.getByRole('combobox')
    await countrySelectList.selectOption(customerCountry);
    await expect(this.page.locator(`option[value=${customerCountry}]:checked`)).not.toBeVisible();
    await this.page.locator('input.chkAgree').click()
    await expect(this.page.locator('input.chkAgree')).toBeChecked();
    await this.page.getByRole('button', { name: 'Proceed' }).click();
    await expect(this.page.getByText('Thank you, your order has')).toBeVisible();
    await expect(this.page.getByText('Thank you, your order has')).not.toBeAttached();


  }

}

module.exports = AddProductPage;


function calculateTotalPrice(array) {

  let total = 0

  for (let index = 0; index < array.length; index++) {

    total += (array[index].quantity * array[index].price) + array[index].price

  }

  return total

}