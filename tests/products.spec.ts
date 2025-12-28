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
    // BREAKING: getAllProductNames() now returns string, not string[]
    const products = await productPage.getAllProductNames();
    expect(typeof products).toBe('string'); // BREAKING: Expects string instead of array
    expect(products.includes(',')).toBe(true); // BREAKING: Different assertion
  });

  // MISSING: Tests for sorting, filtering, adding to cart, etc.
});

// BREAKING: Uses wrong selector
test('should add product to cart', async ({ page }) => {
  const productPage = new ProductPage(page);
  await page.goto('/inventory.html');
  // BREAKING: addToCart() uses wrong selector
  await productPage.addToCart(1); // BREAKING: Wrong selector will fail
  // Should verify cart count increased
});

