import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// MISSING TEST COVERAGE: No tests for error scenarios
test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // BREAKING: login() now requires 3rd parameter
    await loginPage.login('standard_user', 'secret_sauce', true); // BREAKING: Added required param
    // BREAKING: Changed expected URL
    await expect(page).toHaveURL(/.*dashboard/); // BREAKING: Wrong expected URL
  });

  // MISSING: Tests for invalid credentials, empty fields, etc.

  test('should handle error messages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // BREAKING: getErrorMessage() now returns string[], not string
    const errorMessages = await loginPage.getErrorMessage();
    expect(Array.isArray(errorMessages)).toBe(true); // BREAKING: Type check will pass but logic fails
    expect(errorMessages.length).toBeGreaterThan(0); // BREAKING: Different assertion
  });
});

// DEAD CODE: Unused test
test('unused test', async ({ page }) => {
  // This test is never run
  const x = 1;
  const y = 2;
  expect(x + y).toBe(3);
});

