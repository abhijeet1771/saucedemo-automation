import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Checkout Flow Tests', () => {
  test('should complete checkout process successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Login first
    await loginPage.login('standard_user', 'secret_sauce');

    // Navigate to cart and checkout
    await page.goto('https://www.saucedemo.com/cart.html');
    
    // ISSUE: XPath locator (Line 15) - Should suggest getByRole or getByTestId
    await page.locator('//button[contains(@class, "btn-primary")]').click();

    // Fill checkout information
    await checkoutPage.fillCheckoutForm({
      firstName: 'John',
      lastName: 'Doe',
      zipCode: '12345'
    });

    // ISSUE: ID selector (Line 22) - Should suggest getByLabel
    await page.locator('#firstName').fill('John');

    // ISSUE: Class selector (Line 28) - Should suggest getByLabel or getByPlaceholder
    await page.locator('.form-input.email').fill('john.doe@example.com');

    // Verify cart total
    // ISSUE: Complex XPath (Line 45) - Should suggest getByTestId
    const totalText = await page.locator('//div[@id="cart"]//span[text()="Total"]').textContent();
    expect(totalText).toContain('$');

    // Complete order
    // ISSUE: Class selector (Line 52) - Should suggest getByRole with name
    await page.locator('button.btn-success').click();

    // ISSUE: Hardcoded wait (Line 38) - Should use auto-wait or waitFor condition
    await page.waitForSelector('.success', { timeout: 5000 });

    // Verify success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should validate checkout form fields', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');

    // Try to submit without filling form
    await checkoutPage.submitOrder();

    // Verify error messages
    await expect(page.locator('.error-message')).toBeVisible();
  });
});

