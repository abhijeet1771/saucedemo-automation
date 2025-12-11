import { Page } from '@playwright/test';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  zipCode: string;
  email?: string;
}

export class CheckoutPage {
  constructor(private page: Page) {}

  /**
   * Fill checkout form with user data
   * BREAKING CHANGE: Signature changed from fillCheckoutForm(username, password, email)
   * to fillCheckoutForm(userData: CheckoutFormData)
   * This will break all existing callers!
   */
  async fillCheckoutForm(userData: CheckoutFormData): Promise<void> {
    // ISSUE: XPath selector (Line 18) - Should suggest getByLabel('First Name')
    await this.page.locator('//input[@id="firstName"]').fill(userData.firstName);

    // ISSUE: ID selector (Line 25) - Should suggest getByLabel('Last Name')
    await this.page.locator('#lastName').fill(userData.lastName);

    // ISSUE: Class selector (Line 32) - Should suggest getByLabel('ZIP Code')
    await this.page.locator('.zip-code-input').fill(userData.zipCode);

    if (userData.email) {
      await this.page.getByLabel('Email').fill(userData.email);
    }
  }

  /**
   * Submit the order
   * ISSUE: Missing error handling (Line 58)
   */
  async submitOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.getByRole('button', { name: 'Finish' }).click();
    // Missing try-catch - what if payment fails?
    // Missing validation - what if form is incomplete?
  }

  async getOrderTotal(): Promise<string> {
    const totalElement = await this.page.getByTestId('order-total');
    return await totalElement.textContent() || '';
  }

  async verifyOrderConfirmation(): Promise<boolean> {
    const confirmationMessage = this.page.getByText('Thank you for your order!');
    return await confirmationMessage.isVisible();
  }

  // OLD METHOD - This was removed, causing breaking change
  // async fillCheckoutForm(username: string, password: string, email: string): Promise<void> {
  //   // Old implementation
  // }
}

