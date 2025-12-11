import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

// MISSING TEST COVERAGE: Limited edge cases
test.describe('Product Tests', () => {
  test('should display products', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    const productPage = new ProductPage(page);
    const products = await productPage.getAllProductNames();
    expect(products.length).toBeGreaterThan(0);
  });

  // MISSING: Tests for sorting, filtering, adding to cart, etc.
});

// CODE SMELL: Test with hardcoded values
test('should add product to cart', async ({ page }) => {
  // Hardcoded product ID - should use test data
  await page.goto('/inventory.html');
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  // Should verify cart count increased
});

