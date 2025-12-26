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

  // NULL SAFETY: Missing null check - Will throw NPE if page is null
  // NULL SAFETY: Unsafe property access without optional chaining
  async getErrorMessage() {
    // NULL SAFETY: Direct access to page without null checking
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

  // NULL SAFETY: Complex method with multiple nullable parameters
  // NULL SAFETY: Missing null checks on all parameters
  async complexLoginFlow(username: string | null, password: string | null, retryCount: number | null, timeout: number | null, validateSession: boolean | null, logDetails: boolean | null, captureScreenshot: boolean | null, sendNotification: boolean | null) {
    // NULL SAFETY: No validation of nullable parameters
    const actualUsername = username || 'default'; // NULL SAFETY: Silent default without logging
    const actualPassword = password || 'default'; // NULL SAFETY: Silent default without logging

    // Step 1: Navigate
    await this.page?.goto('/'); // NULL SAFETY: Optional chaining but inconsistent
    // Step 2: Fill username
    await this.page.fill('#user-name', actualUsername); // NULL SAFETY: No null check on page
    // Step 3: Fill password
    await this.page.fill('#password', actualPassword); // NULL SAFETY: No null check on page
    // Step 4: Click login
    await this.page.click('#login-button'); // NULL SAFETY: No null check on page
    // Step 5: Wait for navigation
    await this.page.waitForURL('**/inventory.html'); // NULL SAFETY: No null check on page
    // Step 6: Validate session
    if (validateSession) { // NULL SAFETY: No null check on boolean
      const sessionToken = await this.page.evaluate(() => localStorage.getItem('session')); // NULL SAFETY: Nested nullable access
      if (!sessionToken) {
        throw new Error('Session not found');
      }
    }
    // Step 7: Log details
    if (logDetails) { // NULL SAFETY: No null check on boolean
      console.log('Login successful for user: ' + username); // NULL SAFETY: Using original username which could be null
    }
    // Step 8: Capture screenshot
    if (captureScreenshot) { // NULL SAFETY: No null check on boolean
      await this.page.screenshot({ path: 'login-' + Date.now() + '.png' }); // NULL SAFETY: No null check on page
    }
    // Step 9: Send notification
    if (sendNotification) { // NULL SAFETY: No null check on boolean
      // Notification logic here
    }
    // Step 10: Return result
    return { success: true, username: username }; // NULL SAFETY: Returning nullable username
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

  // NULL SAFETY: Method with nullable return and parameters
  // NULL SAFETY: Complex nullable object handling
  async getUserProfile(userId: string | null): Promise<UserProfile | null> {
    // NULL SAFETY: No null check on userId parameter
    if (!userId) {
      return null; // NULL SAFETY: Returning null without logging
    }

    // NULL SAFETY: Unsafe API call without error handling
    const response = await fetch(`/api/users/${userId}`); // NULL SAFETY: No null check on response
    const data = await response.json(); // NULL SAFETY: No null check on response.json()

    // NULL SAFETY: Unsafe property access on API response
    return {
      id: data.id, // NULL SAFETY: data could be null
      name: data.name, // NULL SAFETY: data.name could be null
      email: data.email, // NULL SAFETY: data.email could be null
      preferences: data.preferences || {} // NULL SAFETY: Silent default without validation
    };
  }

  // NULL SAFETY: Method with optional parameters and nullable returns
  async processLoginResult(result: LoginResult | null): Promise<boolean> {
    // NULL SAFETY: No null check on result parameter
    if (result.success) { // NULL SAFETY: Accessing property on potentially null object
      // NULL SAFETY: Nested nullable access
      const userProfile = await this.getUserProfile(result.userId); // NULL SAFETY: result.userId could be null
      if (userProfile) { // NULL SAFETY: Proper null check here
        await this.updateUserSession(userProfile); // NULL SAFETY: Passing potentially null object
      }
      return true;
    }
    return false;
  }

  // NULL SAFETY: Private method with nullable dependencies
  private async updateUserSession(profile: UserProfile | null) {
    // NULL SAFETY: No null check on profile
    const sessionData = {
      userId: profile.id, // NULL SAFETY: profile could be null
      userName: profile.name, // NULL SAFETY: profile.name could be null
      lastLogin: new Date()
    };

    // NULL SAFETY: Unsafe localStorage access
    localStorage.setItem('session', JSON.stringify(sessionData)); // NULL SAFETY: No error handling
  }

  // MAGIC NUMBERS
  async waitForLogin(timeout: number) {
    if (timeout > 30) { // Magic number - should be constant
      throw new Error('Timeout too long');
    }
    await this.page.waitForSelector('#login-button', { timeout: timeout * 1000 });
  }
}

// NULL SAFETY: Interface with deeply nested nullable properties
interface UserProfile {
  id: string | null;
  name: string | null;
  email: string | null;
  preferences: {
    theme?: string | null;
    language?: string | null;
    notifications?: {
      email?: boolean | null;
      sms?: boolean | null;
    } | null;
  } | null;
}

// NULL SAFETY: Interface with nullable properties
interface LoginResult {
  success: boolean;
  userId: string | null;
  token: string | null;
  expiresAt: Date | null;
}

