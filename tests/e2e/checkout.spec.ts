// FRAMEWORK VIOLATION: Test file with Playwright anti-patterns and testing framework issues
// FRAMEWORK VIOLATION: Poor test isolation, shared state, improper waits
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow Tests', () => {
  // FRAMEWORK VIOLATION: Global state shared between tests
  let sharedCartItems: any[] = [];
  let testUserSession: any = null;

  test.beforeAll(async ({ browser }) => {
    // FRAMEWORK VIOLATION: Heavy setup in beforeAll (slows down test execution)
    const page = await browser.newPage();
    await page.goto('/');

    // FRAMEWORK VIOLATION: Setting up global state that affects other tests
    testUserSession = {
      page: page,
      userId: Math.random(),
      timestamp: Date.now()
    };

    // FRAMEWORK VIOLATION: Pre-adding items that other tests depend on
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    sharedCartItems = ['backpack', 'bike-light'];
  });

  test('should display cart items correctly', async ({ page }) => {
    // FRAMEWORK VIOLATION: Using global state instead of independent test setup
    expect(sharedCartItems).toContain('backpack');
    expect(sharedCartItems).toContain('bike-light');

    // FRAMEWORK VIOLATION: Arbitrary wait without condition
    await page.waitForTimeout(2000);

    // FRAMEWORK VIOLATION: Hardcoded locator without data-testid
    await page.click('.shopping_cart_link');

    // FRAMEWORK VIOLATION: No proper assertion wait
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
  });

  test('should proceed to checkout', async ({ page }) => {
    // FRAMEWORK VIOLATION: Depending on previous test state
    await page.click('.shopping_cart_link');

    // FRAMEWORK VIOLATION: XPath locator (slow and brittle)
    await page.click('//button[contains(text(), "Checkout")]');

    // FRAMEWORK VIOLATION: Fixed wait instead of condition-based wait
    await page.waitForTimeout(3000);

    // FRAMEWORK VIOLATION: Asserting on loading state
    await expect(page.locator('.loading-spinner')).toBeVisible();

    // FRAMEWORK VIOLATION: Another fixed wait
    await page.waitForTimeout(2000);
  });

  test('should fill checkout form', async ({ page }) => {
    // FRAMEWORK VIOLATION: Complex CSS selector (brittle)
    await page.fill('form.checkout_info input[name="firstName"]', 'John');
    await page.fill('form.checkout_info input[name="lastName"]', 'Doe');
    await page.fill('form.checkout_info input[name="postalCode"]', '12345');

    // FRAMEWORK VIOLATION: Clicking without waiting for element stability
    await page.click('input[type="submit"]');

    // FRAMEWORK VIOLATION: Race condition - no wait for navigation
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('should complete purchase', async ({ page }) => {
    // FRAMEWORK VIOLATION: Text-based selector (language-dependent)
    await page.click('button:has-text("Finish")');

    // FRAMEWORK VIOLATION: Waiting for arbitrary time
    await page.waitForTimeout(5000);

    // FRAMEWORK VIOLATION: Asserting with generic locator
    await expect(page.locator('.complete-header')).toContainText('Thank you');
  });

  // FRAMEWORK VIOLATION: afterAll not cleaning up global state
  test.afterAll(async () => {
    // FRAMEWORK VIOLATION: Not cleaning up shared state
    // sharedCartItems and testUserSession remain polluted
  });
});

// FRAMEWORK VIOLATION: Separate test suite with shared setup issues
test.describe('Product Search Tests', () => {
  // FRAMEWORK VIOLATION: Shared page instance between tests
  let sharedPage: any;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
    await sharedPage.goto('/');
  });

  test('should search for backpack', async () => {
    // FRAMEWORK VIOLATION: Using shared page instance
    await sharedPage.fill('.search-input', 'backpack');

    // FRAMEWORK VIOLATION: ID-based selector (may not be stable)
    await sharedPage.click('#search-button');

    // FRAMEWORK VIOLATION: No wait strategy
    await sharedPage.waitForTimeout(1000);

    // FRAMEWORK VIOLATION: Text-based assertion (fragile)
    await expect(sharedPage.locator('h3')).toContainText('Sauce Labs Backpack');
  });

  test('should search for bike light', async () => {
    // FRAMEWORK VIOLATION: Shared page state from previous test
    // Search input may still contain 'backpack'
    await sharedPage.fill('.search-input', 'bike light');

    await sharedPage.click('#search-button');
    await sharedPage.waitForTimeout(1000);

    await expect(sharedPage.locator('h3')).toContainText('Sauce Labs Bike Light');
  });

  test('should handle empty search', async () => {
    // FRAMEWORK VIOLATION: Shared state affects test behavior
    await sharedPage.fill('.search-input', '');
    await sharedPage.click('#search-button');

    // FRAMEWORK VIOLATION: Generic wait
    await sharedPage.waitForTimeout(500);

    // FRAMEWORK VIOLATION: Asserting on absence without proper wait
    await expect(sharedPage.locator('.no-results')).toBeVisible();
  });
});

// FRAMEWORK VIOLATION: Flaky test patterns
test.describe('Flaky Tests Suite', () => {
  test('should sometimes pass, sometimes fail', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: Random delay causing flakiness
    const randomDelay = Math.floor(Math.random() * 5000);
    await page.waitForTimeout(randomDelay);

    // FRAMEWORK VIOLATION: Race condition with page load
    await page.click('[data-test="login-button"]');

    // FRAMEWORK VIOLATION: Assertion without proper wait
    const error = page.locator('.error-message');
    // Sometimes passes, sometimes fails based on timing
    await expect(error).toBeVisible();
  });

  test('should depend on external timing', async ({ page }) => {
    await page.goto('/inventory');

    // FRAMEWORK VIOLATION: Network-dependent wait
    await page.waitForTimeout(8000); // Wait for slow API

    // FRAMEWORK VIOLATION: No retry mechanism for network failures
    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6);
  });

  test('should fail on slow networks', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: No network condition handling
    await page.route('**/api/products', async route => {
      // FRAMEWORK VIOLATION: Artificial delay causing flakiness
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000));
      await route.fulfill({ json: [] });
    });

    // FRAMEWORK VIOLATION: Test assumes instant API response
    await expect(page.locator('.inventory_item')).toHaveCount(0);
  });
});

// FRAMEWORK VIOLATION: Test with environment dependencies
test.describe('Environment Dependent Tests', () => {
  test('should work only in Chrome', async ({ page, browserName }) => {
    // FRAMEWORK VIOLATION: Browser-specific logic in tests
    if (browserName !== 'chromium') {
      test.skip();
      return;
    }

    // FRAMEWORK VIOLATION: Browser-specific selectors
    const selector = browserName === 'chromium' ? '[data-test="chrome-only"]' : '[data-test="other"]';
    await page.click(selector);
  });

  test('should work only on desktop', async ({ page, viewport }) => {
    // FRAMEWORK VIOLATION: Viewport-dependent logic
    if (!viewport || viewport.width < 768) {
      test.skip();
      return;
    }

    // FRAMEWORK VIOLATION: Desktop-only interactions
    await page.hover('.desktop-menu');
    await page.click('.desktop-submenu-item');
  });

  test('should work only when API is up', async ({ page }) => {
    // FRAMEWORK VIOLATION: External dependency without mocking
    try {
      const response = await page.request.get('https://api.third-party.com/health');
      if (response.status() !== 200) {
        test.skip();
        return;
      }
    } catch (error) {
      test.skip();
      return;
    }

    // FRAMEWORK VIOLATION: Test depends on external service availability
    await page.click('[data-test="external-service-button"]');
  });
});
