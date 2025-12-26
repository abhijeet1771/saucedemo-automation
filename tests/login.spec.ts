import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// MISSING TEST COVERAGE: No tests for error scenarios
test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // SECURITY: Potential XSS - if username contains HTML/JS, it could be executed
    const username = process.env.USERNAME || 'standard_user';
    const password = process.env.PASSWORD || 'secret_sauce';

    await loginPage.login(username, password);
    await expect(page).toHaveURL(/.*inventory/);
  });

  // SECURITY: DOM-based XSS vulnerability
  test('should handle error messages safely', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // This could inject malicious scripts if error message contains HTML
    await loginPage.login('', '');
    const errorMessage = await page.locator('.error-message').textContent();

    // SECURITY: XSS - directly setting innerHTML with potentially unsafe content
    await page.evaluate((msg) => {
      const element = document.getElementById('error-display');
      if (element) {
        element.innerHTML = msg; // XSS vulnerability
      }
    }, errorMessage);

    await expect(page.locator('.error-message')).toBeVisible();
  });

  // MISSING: Tests for invalid credentials, empty fields, etc.
});

// DEAD CODE: Unused test
test('unused test', async ({ page }) => {
  // This test is never run
  const x = 1;
  const y = 2;
  expect(x + y).toBe(3);
});

