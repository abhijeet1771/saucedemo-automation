import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

// BREAKING: Integration test that will fail due to API changes
test.describe('Integration Breaking Tests', () => {
  test('should complete full user flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    // This will fail because login signature changed
    await loginPage.login('standard_user', 'secret_sauce', true); // BREAKING: 3rd param required

    // This will fail because URL expectation changed
    await expect(page).toHaveURL(/.*dashboard/); // BREAKING: Wrong expected URL

    // This will fail because getAllProductNames returns string not array
    const productNames = await productPage.getAllProductNames();
    expect(Array.isArray(productNames)).toBe(true); // BREAKING: Will fail

    // This will fail because addToCart uses wrong selector
    await productPage.addToCart(1); // BREAKING: Wrong selector will fail
  });

  test('should handle error scenarios', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // This will fail because getErrorMessage returns array not string
    const errorMsg = await loginPage.getErrorMessage();
    expect(typeof errorMsg).toBe('string'); // BREAKING: Will fail - returns array
  });
});
