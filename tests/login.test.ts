import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

// ⚪ NO IMPACT: Test file modification (doesn't affect production)
test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce', false);
    await expect(page).toHaveURL('**/inventory.html');
  });

  test('should handle login errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const result = await loginPage.loginWithErrorHandling('invalid_user', 'wrong_pass');
    expect(result).toBe(false);
  });

  // New test case
  test('should remember user when remember me is checked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce', true);
    // Verify remember me functionality
  });
});
