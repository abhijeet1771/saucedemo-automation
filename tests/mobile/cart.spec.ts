// FRAMEWORK VIOLATION: Mobile testing with framework-specific anti-patterns
// FRAMEWORK VIOLATION: Appium and mobile testing framework violations
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Cart Tests', () => {
  // FRAMEWORK VIOLATION: Hardcoded device configuration
  test.use({
    ...devices['iPhone 12'], // FRAMEWORK VIOLATION: Specific device dependency
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  test('should add item to cart on mobile', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: Mobile-specific selectors (fragile)
    const addToCartButton = page.locator('.btn_inventory').first();

    // FRAMEWORK VIOLATION: Touch interactions without mobile checks
    await addToCartButton.tap();

    // FRAMEWORK VIOLATION: Mobile viewport assumptions
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();

    // FRAMEWORK VIOLATION: No swipe gesture handling
    // FRAMEWORK VIOLATION: No orientation change testing
  });

  test('should handle mobile keyboard', async ({ page }) => {
    await page.goto('/login');

    // FRAMEWORK VIOLATION: Keyboard interactions without mobile checks
    await page.fill('#user-name', 'testuser');

    // FRAMEWORK VIOLATION: No virtual keyboard handling
    // FRAMEWORK VIOLATION: No keyboard hide/show testing
    // FRAMEWORK VIOLATION: No keyboard type testing (numeric, text, etc.)
  });

  test('should work with device orientation', async ({ page, browserName }) => {
    // FRAMEWORK VIOLATION: Browser-specific mobile logic
    test.skip(browserName !== 'webkit', 'Orientation tests only work on WebKit');

    await page.goto('/');

    // FRAMEWORK VIOLATION: Manual orientation change (not reliable)
    await page.evaluate(() => {
      // This doesn't actually change device orientation
      window.dispatchEvent(new Event('orientationchange'));
    });

    // FRAMEWORK VIOLATION: No actual orientation testing
    // FRAMEWORK VIOLATION: No landscape/portrait layout verification
  });
});

// FRAMEWORK VIOLATION: Cross-platform testing anti-patterns
test.describe('Cross-Platform Compatibility Tests', () => {
  // FRAMEWORK VIOLATION: Multiple device configurations with code duplication
  const testDevices = [
    devices['iPhone 12'],
    devices['Pixel 5'],
    { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } }
  ];

  // FRAMEWORK VIOLATION: Parameterized tests with device-specific logic
  for (const device of testDevices) {
    test(`should work on ${device.name || 'unknown device'}`, async ({ page }) => {
      // FRAMEWORK VIOLATION: Device-specific test logic
      await page.setViewportSize(device.viewport);

      await page.goto('/');

      // FRAMEWORK VIOLATION: Conditional logic based on device
      if (device.hasTouch) {
        // FRAMEWORK VIOLATION: Touch-specific interactions
        await page.locator('.inventory_item').first().tap();
      } else {
        // FRAMEWORK VIOLATION: Mouse-specific interactions
        await page.locator('.inventory_item').first().click();
      }

      // FRAMEWORK VIOLATION: Device-specific assertions
      if (device.isMobile) {
        await expect(page.locator('.mobile-menu')).toBeVisible();
      } else {
        await expect(page.locator('.desktop-menu')).toBeVisible();
      }
    });
  }
});

// FRAMEWORK VIOLATION: API testing mixed with UI testing
test.describe('Hybrid UI/API Tests', () => {
  test('should verify cart state via API and UI', async ({ page, request }) => {
    // FRAMEWORK VIOLATION: Mixing UI and API testing in same test
    await page.goto('/');

    // UI interaction
    await page.click('.btn_inventory');

    // FRAMEWORK VIOLATION: API call in UI test
    const apiResponse = await request.get('/api/cart');
    const cartData = await apiResponse.json();

    // FRAMEWORK VIOLATION: Asserting API state in UI test
    expect(cartData.items).toHaveLength(1);

    // UI assertion
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should handle API failures gracefully in UI', async ({ page }) => {
    // FRAMEWORK VIOLATION: Mocking API in UI test
    await page.route('**/api/cart', route => {
      route.fulfill({ status: 500, json: { error: 'Server Error' } });
    });

    await page.goto('/');
    await page.click('.btn_inventory');

    // FRAMEWORK VIOLATION: Testing error states in UI without proper setup
    // FRAMEWORK VIOLATION: No error boundary testing
    // FRAMEWORK VIOLATION: No fallback UI testing
  });
});

// FRAMEWORK VIOLATION: Performance testing anti-patterns
test.describe('Performance Tests', () => {
  test('should load products within time limit', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/inventory');

    // FRAMEWORK VIOLATION: Arbitrary time assertions
    await page.waitForSelector('.inventory_item', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // FRAMEWORK VIOLATION: Hardcoded performance thresholds
    expect(loadTime).toBeLessThan(5000); // 5 seconds - arbitrary

    // FRAMEWORK VIOLATION: No performance baseline comparison
    // FRAMEWORK VIOLATION: No performance regression detection
  });

  test('should handle many products without performance issues', async ({ page }) => {
    // FRAMEWORK VIOLATION: Mocking large datasets in performance test
    await page.route('**/api/products', route => {
      const largeProductSet = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        price: Math.random() * 100
      }));

      route.fulfill({ json: largeProductSet });
    });

    const startTime = Date.now();
    await page.goto('/inventory');

    // FRAMEWORK VIOLATION: Waiting for all products to load
    await page.waitForSelector(`.inventory_item:nth-child(1000)`);

    const renderTime = Date.now() - startTime;

    // FRAMEWORK VIOLATION: Performance test without proper metrics
    expect(renderTime).toBeLessThan(10000);

    // FRAMEWORK VIOLATION: No memory usage monitoring
    // FRAMEWORK VIOLATION: No performance profiling
  });
});

// FRAMEWORK VIOLATION: Accessibility testing anti-patterns
test.describe('Accessibility Tests', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: Manual accessibility checking
    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      // FRAMEWORK VIOLATION: Basic ARIA checks without comprehensive testing
      const ariaLabel = await button.getAttribute('aria-label');
      const hasText = (await button.textContent())?.trim();

      // FRAMEWORK VIOLATION: Weak accessibility assertions
      expect(ariaLabel || hasText).toBeTruthy();
    }

    // FRAMEWORK VIOLATION: No keyboard navigation testing
    // FRAMEWORK VIOLATION: No screen reader testing
    // FRAMEWORK VIOLATION: No color contrast testing
    // FRAMEWORK VIOLATION: No focus management testing
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: Manual keyboard navigation testing
    await page.keyboard.press('Tab');

    // FRAMEWORK VIOLATION: Checking focus without proper assertions
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeDefined();

    // FRAMEWORK VIOLATION: Incomplete keyboard testing
    // FRAMEWORK VIOLATION: No Enter/Space key testing
    // FRAMEWORK VIOLATION: No Escape key testing
    // FRAMEWORK VIOLATION: No arrow key navigation testing
  });
});

// FRAMEWORK VIOLATION: Visual regression testing anti-patterns
test.describe('Visual Regression Tests', () => {
  test('should match baseline screenshot', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: Basic screenshot comparison without proper setup
    const screenshot = await page.screenshot();

    // FRAMEWORK VIOLATION: No baseline image management
    // FRAMEWORK VIOLATION: No threshold configuration
    // FRAMEWORK VIOLATION: No region-specific comparison
    // FRAMEWORK VIOLATION: No anti-aliasing handling

    expect(screenshot).toBeDefined(); // FRAMEWORK VIOLATION: Meaningless assertion
  });

  test('should handle dynamic content', async ({ page }) => {
    await page.goto('/');

    // FRAMEWORK VIOLATION: Screenshot of page with dynamic content
    await page.screenshot({ path: 'dynamic-content.png' });

    // FRAMEWORK VIOLATION: No dynamic content masking
    // FRAMEWORK VIOLATION: No content stabilization waits
    // FRAMEWORK VIOLATION: No animation completion waits
  });
});

// FRAMEWORK VIOLATION: CI/CD integration anti-patterns
test.describe('CI/CD Integration Tests', () => {
  // FRAMEWORK VIOLATION: Environment-specific test skipping
  test.skip(process.env.CI !== 'true', 'Only run in CI environment');

  test('should work in headless mode', async ({ page }) => {
    // FRAMEWORK VIOLATION: CI-specific test logic
    await page.goto('/');

    // FRAMEWORK VIOLATION: No headless-specific handling
    // FRAMEWORK VIOLATION: No browser argument validation
    // FRAMEWORK VIOLATION: No CI-specific timeout handling
  });

  test('should handle parallel execution', async ({ page }) => {
    // FRAMEWORK VIOLATION: No parallel execution isolation
    await page.goto('/');

    // Add to cart
    await page.click('.btn_inventory');

    // FRAMEWORK VIOLATION: No database isolation between parallel tests
    // FRAMEWORK VIOLATION: No shared resource conflict handling
    // FRAMEWORK VIOLATION: No test data isolation
  });

  test('should generate proper test reports', async ({ page }) => {
    // FRAMEWORK VIOLATION: Manual report generation
    const testResults = {
      name: 'CI/CD Integration Test',
      status: 'passed',
      duration: 1000,
      timestamp: new Date()
    };

    // FRAMEWORK VIOLATION: Direct file writing in tests
    const fs = require('fs');
    fs.writeFileSync('test-results.json', JSON.stringify(testResults));

    // FRAMEWORK VIOLATION: No proper reporting framework usage
    // FRAMEWORK VIOLATION: No JUnit/Allure integration
    // FRAMEWORK VIOLATION: No test metadata attachment
  });
});

// FRAMEWORK VIOLATION: Test data management anti-patterns
test.describe('Test Data Management Tests', () => {
  // FRAMEWORK VIOLATION: Global test data modification
  let testUser: any = null;

  test.beforeAll(async () => {
    // FRAMEWORK VIOLATION: Creating test data in beforeAll
    testUser = {
      id: Math.random(),
      email: `test-${Date.now()}@example.com`,
      name: 'Test User'
    };

    // FRAMEWORK VIOLATION: Direct database modification
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await client.connect();
    await client.query(
      'INSERT INTO users (id, email, name) VALUES ($1, $2, $3)',
      [testUser.id, testUser.email, testUser.name]
    );
    await client.end();
  });

  test('should use created test user', async ({ page }) => {
    // FRAMEWORK VIOLATION: Using global test data
    expect(testUser).toBeDefined();
    expect(testUser.email).toContain('test-');
  });

  test('should modify shared test data', async ({ page }) => {
    // FRAMEWORK VIOLATION: Modifying shared test data
    testUser.name = 'Modified Test User';

    // FRAMEWORK VIOLATION: No data cleanup between tests
    expect(testUser.name).toBe('Modified Test User');
  });

  // FRAMEWORK VIOLATION: No afterAll cleanup
});
