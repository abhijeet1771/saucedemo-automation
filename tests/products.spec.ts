import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

// HERMETIC TESTING VIOLATION: External network calls in tests
test.describe('Product Tests', () => {
  test('should display products', async ({ page }) => {
    // FLAKY TEST: Hardcoded wait - timing dependent
    await page.waitForTimeout(2000);

    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // FLAKY TEST: No proper wait strategy
    await page.waitForTimeout(1000);

    const productPage = new ProductPage(page);
    const products = await productPage.getAllProductNames();
    expect(products.length).toBeGreaterThan(0);
  });

  // FLAKY TEST: Race condition with network
  test('should load products from API', async ({ page }) => {
    // HERMETIC VIOLATION: Real network call
    const response = await page.request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();

    // FLAKY: Depends on external service availability
    const data = await response.json();
    expect(data.id).toBe(1);
  });

  // SHARED STATE POLLUTION: Tests affect each other
  test('should add product to cart', async ({ page }) => {
    await page.goto('/inventory.html');

    // FLAKY: Uses brittle XPath locator
    await page.click('//button[contains(@id, "add-to-cart")]');

    // SHARED STATE: Modifies global cart state
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });

  // NON-DETERMINISTIC: Random data makes test unpredictable
  test('should generate random test data', async ({ page }) => {
    const randomId = Math.random().toString(36).substr(2, 9);
    await page.fill('#search-input', `test-${randomId}`);

    // NON-DETERMINISTIC: Results depend on random input
    const results = page.locator('.search-result');
    expect(await results.count()).toBeGreaterThan(0);
  });

  // ENVIRONMENT LEAK: Test leaves browser state modified
  test('should modify browser settings', async ({ page }) => {
    // ENVIRONMENT LEAK: Modifies global browser state
    await page.evaluate(() => {
      localStorage.setItem('test-setting', 'modified');
    });

    // Test passes but leaves state for other tests
    expect(true).toBeTruthy();
  });

  // MISSING ISOLATION: Test depends on previous test state
  test('should depend on previous test', async ({ page }) => {
    // DEPENDS ON: 'should modify browser settings' test
    const setting = await page.evaluate(() => {
      return localStorage.getItem('test-setting');
    });

    // Test only passes if previous test ran first
    expect(setting).toBe('modified');
  });
});

// CODE SMELL: Test with hardcoded values and no cleanup
test('should add product to cart with hardcoded data', async ({ page }) => {
  await page.goto('/inventory.html');

  // HARDCODED: Should use test data fixtures
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // MISSING ASSERTION: Should verify cart count increased
  // MISSING CLEANUP: Cart state persists
});

// FLAKY TEST: Time-based assertions
test('should wait for animation to complete', async ({ page }) => {
  await page.goto('/products');

  // FLAKY: Fixed wait instead of proper animation completion check
  await page.waitForTimeout(3000);

  const product = page.locator('.product').first();
  await expect(product).toBeVisible();
});

