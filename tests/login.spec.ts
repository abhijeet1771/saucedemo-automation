import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// MISSING TEST COVERAGE: No tests for error scenarios
test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory/);
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

