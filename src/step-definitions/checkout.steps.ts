import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

let loginPage: LoginPage;
let checkoutPage: CheckoutPage;

// 🟢 SAFE CHANGE: New step definitions
Given('I am logged in as a standard user', async function() {
  loginPage = new LoginPage(this.page);
  await loginPage.login('standard_user', 'secret_sauce', false);
});

When('I add items to cart', async function() {
  // Implementation for adding items
});

When('I proceed to checkout', async function() {
  checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.proceedToCheckout();
});

Then('I should see new payment options', async function() {
  await expect(checkoutPage.paymentOptions).toBeVisible();
});

Then('I should be able to complete checkout', async function() {
  await checkoutPage.completeCheckout();
  await expect(this.page).toHaveURL('**/checkout-complete.html');
});
