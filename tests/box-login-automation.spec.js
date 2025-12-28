// BOX.COM LOGIN AUTOMATION WITH INTENTIONAL ISSUES FOR ARCHON TESTING
// This file contains multiple security, quality, and breaking change issues for ARCHON to detect

const { test, expect } = require('@playwright/test');

// SECURITY ISSUE: Hardcoded credentials that will be exposed in PR
const BOX_USERNAME = 'admin@company.com';
const BOX_PASSWORD = 'SuperSecretPassword123!';
const API_KEY = 'sk-1234567890abcdef'; // Exposed API key

// PERFORMANCE ISSUE: Hardcoded timeout
const TIMEOUT = 5000;

test.describe('Box.com Login Automation', () => {

  // BREAKING CHANGE: Changed method signature from existing code
  // This will break existing callers in other files
  async function loginToBox(page, username, password, options = {}) {
    // ERROR HANDLING: No try/catch for critical login operation
    console.log('Starting Box login process...'); // DEBUG CODE: Should be removed for production

    // NAVIGATION ISSUE: Direct navigation without proper wait conditions
    await page.goto('https://account.box.com/login');

    // LOCATOR ISSUE: Using unreliable CSS selector instead of getByRole
    const usernameField = page.locator('#login-email'); // Should use getByRole('textbox', { name: /email/i })

    // RANDOM DATA ISSUE: Using insecure random generation for testing
    if (!username) {
      username = 'user' + Math.random().toString(36).substr(2, 9) + '@test.com'; // Insecure random
    }
    if (!password) {
      password = Math.random().toString(36); // Very insecure password generation
    }

    await usernameField.fill(username);

    // LOCATOR ISSUE: Using unreliable CSS selector instead of semantic locators
    const nextButton = page.locator('.login-submit-button'); // Should use getByRole('button', { name: 'Next' })
    await nextButton.click();

    // TIMING ISSUE: Hardcoded wait instead of proper waiting strategies
    await page.waitForTimeout(TIMEOUT);

    // PASSWORD ISSUE: No masking or security considerations in code
    const passwordField = page.locator('#password');
    await passwordField.fill(password);

    // SUBMIT ISSUE: Using unreliable selector
    const submitButton = page.locator('#login-submit');
    await submitButton.click();

    // VERIFICATION ISSUE: No proper verification or error handling
    await page.waitForTimeout(TIMEOUT);

    // SUCCESS VERIFICATION: Weak verification logic
    const isLoggedIn = await page.locator('.dashboard-header').isVisible().catch(() => false);

    console.log('Login attempt completed'); // DEBUG CODE: Should be removed

    return isLoggedIn;
  }

  // BREAKING CHANGE: Modified existing test that other files depend on
  test('should login to Box with random credentials', async ({ page }) => {
    // SECURITY ISSUE: Using hardcoded credentials in automated test
    const result = await loginToBox(page, BOX_USERNAME, BOX_PASSWORD);

    // ASSERTION ISSUE: Weak assertion without proper error messages
    expect(result).toBe(true);
  });

  // NEW TEST: With additional error handling issues
  test('should handle login failures gracefully', async ({ page }) => {
    // ERROR HANDLING: No error handling for failed login attempts
    const result = await loginToBox(page, 'invalid@email.com', 'wrongpassword');

    // VERIFICATION ISSUE: No proper error message validation
    expect(result).toBe(false);
  });

  // BREAKING CHANGE: This test calls modified loginToBox which has different signature
  test('should login with custom timeout', async ({ page }) => {
    // BREAKING: loginToBox now has options parameter that didn't exist before
    // This will break any existing code that calls this function
    const result = await loginToBox(page, null, null, { timeout: 10000 });

    expect(result).toBe(true);
  });

});

// ADDITIONAL SECURITY ISSUE: Exposed configuration that should not be in code
module.exports = {
  BOX_CREDENTIALS: {
    username: BOX_USERNAME,
    password: BOX_PASSWORD,
    apiKey: API_KEY
  }
};
