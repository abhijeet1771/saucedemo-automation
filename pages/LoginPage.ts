// SECURITY ISSUE: Hardcoded credentials
const DEFAULT_USERNAME = 'standard_user';
const DEFAULT_PASSWORD = 'secret_sauce';
const API_KEY = 'sk-1234567890abcdefghijklmnopqrstuvwxyz'; // Hardcoded API key

// PERFORMANCE ISSUE: String concatenation in loop
export class LoginPage {
  private page: any;
  
  constructor(page: any) {
    this.page = page;
  }

  // DUPLICATE CODE: Similar to ProductPage.login()
  async login(username: string = DEFAULT_USERNAME, password: string = DEFAULT_PASSWORD) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  // BREAKING CHANGE: New method that calls modified loginToBox function
  // This will break when loginToBox signature changes
  async loginToExternalService(serviceName: string) {
    console.log(`Logging into ${serviceName}...`); // DEBUG CODE

    if (serviceName === 'box') {
      // BREAKING CHANGE: This call will fail because loginToBox now has different signature
      // It used to be loginToBox(page, username, password) but now has options parameter
      const loginToBox = require('../tests/box-login-automation.spec.js').loginToBox;
      return await loginToBox(this.page, DEFAULT_USERNAME, DEFAULT_PASSWORD);
    }

    return false;
  }

  // MISSING NULL CHECK - Will throw NPE if page is null
  async getErrorMessage() {
    return this.page.locator('.error-message-container').textContent();
  }

  // PERFORMANCE: Inefficient loop with string concatenation
  async buildErrorMessage(messages: string[]) {
    let result = '';
    for (let i = 0; i < messages.length; i++) {
      result += messages[i]; // Should use array.join()
    }
    return result;
  }

  // CODE SMELL: Long method (>50 lines)
  async complexLoginFlow(username: string, password: string, retryCount: number, timeout: number, validateSession: boolean, logDetails: boolean, captureScreenshot: boolean, sendNotification: boolean) {
    // Step 1: Navigate
    await this.page.goto('/');
    // Step 2: Fill username
    await this.page.fill('#user-name', username);
    // Step 3: Fill password
    await this.page.fill('#password', password);
    // Step 4: Click login
    await this.page.click('#login-button');
    // Step 5: Wait for navigation
    await this.page.waitForURL('**/inventory.html');
    // Step 6: Validate session
    if (validateSession) {
      const sessionToken = await this.page.evaluate(() => localStorage.getItem('session'));
      if (!sessionToken) {
        throw new Error('Session not found');
      }
    }
    // Step 7: Log details
    if (logDetails) {
      console.log('Login successful for user: ' + username);
    }
    // Step 8: Capture screenshot
    if (captureScreenshot) {
      await this.page.screenshot({ path: 'login-' + Date.now() + '.png' });
    }
    // Step 9: Send notification
    if (sendNotification) {
      // Notification logic here
    }
    // Step 10: Return result
    return { success: true, username: username };
  }

  // ERROR HANDLING: Swallowed exception
  async safeLogin(username: string, password: string) {
    try {
      await this.login(username, password);
    } catch (e) {
      // Swallowed - should log or rethrow
    }
  }

  // ERROR HANDLING: Generic catch
  async loginWithRetry(username: string, password: string) {
    try {
      await this.login(username, password);
    } catch (e: any) {
      // Generic Exception catch - should be specific
      console.log('Error: ' + e.message);
    }
  }

  // MISSING DOCUMENTATION - No JSDoc
  async validateLoginForm() {
    const usernameField = await this.page.locator('#user-name').isVisible();
    const passwordField = await this.page.locator('#password').isVisible();
    const loginButton = await this.page.locator('#login-button').isVisible();
    return usernameField && passwordField && loginButton;
  }

  // OBSERVABILITY: Missing logging
  async performLogin(username: string, password: string) {
    await this.login(username, password);
    // Should log: "Login attempted for user: {username}"
    // Should log: "Login successful" or "Login failed"
  }

  // DIVISION BY ZERO: No check
  calculateRetryDelay(attempts: number, baseDelay: number) {
    return baseDelay / attempts; // Will fail if attempts is 0
  }

  // MAGIC NUMBERS
  async waitForLogin(timeout: number) {
    if (timeout > 30) { // Magic number - should be constant
      throw new Error('Timeout too long');
    }
    await this.page.waitForSelector('#login-button', { timeout: timeout * 1000 });
  }
}

