// BREAKING: Complete redesign with dependency injection and new types
import { User, AppError, ValidationError, AuthenticationError } from '../types/CoreTypes';

interface LoginPageConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  environment: 'dev' | 'staging' | 'prod';
}

interface LoginResult {
  success: boolean;
  user?: User;
  sessionToken?: string;
  errors?: string[];
}

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string; // BREAKING: Added MFA support
}

// BREAKING: Constructor now requires configuration
export class LoginPage {
  private page: any;
  private config: LoginPageConfig;

  constructor(page: any, config: LoginPageConfig) {
    this.page = page;
    this.config = config;
  }

  // BREAKING: Complete redesign with new return type and error handling
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      // BREAKING: Input validation required
      this.validateCredentials(credentials);

      // BREAKING: Different selectors used
      await this.page.fill('[data-test="username"]', credentials.username);
      await this.page.fill('[data-test="password"]', credentials.password);

      if (credentials.rememberMe) {
        await this.page.check('[data-test="remember-me"]');
      }

      if (credentials.mfaCode) {
        await this.page.fill('[data-test="mfa-code"]', credentials.mfaCode);
      }

      await this.page.click('[data-test="login-button"]');

      // BREAKING: Wait for different URL pattern
      await this.page.waitForURL('**/dashboard', { timeout: this.config.timeout });

      // BREAKING: Return complex object instead of void
      return {
        success: true,
        user: await this.getCurrentUser(),
        sessionToken: await this.getSessionToken()
      };

    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  // BREAKING: New method for validation
  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.username?.trim()) {
      throw new ValidationError('username', 'Username is required');
    }
    if (!credentials.password?.trim()) {
      throw new ValidationError('password', 'Password is required');
    }
    if (credentials.username.length < 3) {
      throw new ValidationError('username', 'Username must be at least 3 characters');
    }
    if (credentials.password.length < 8) {
      throw new ValidationError('password', 'Password must be at least 8 characters');
    }
  }

  // BREAKING: New method required
  private async getCurrentUser(): Promise<User> {
    // Simulate fetching user data
    return {
      uuid: 'user-123',
      email: 'user@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        }
      },
      permissions: [{ resource: 'products', actions: ['read', 'write'] }],
      metadata: {}
    };
  }

  // BREAKING: New method required
  private async getSessionToken(): Promise<string> {
    return 'session-token-abc123';
  }

  // BREAKING: Method removed - use login() result instead
  // async getErrorMessage(): Promise<string | null> {
  //   if (!this.page) throw new Error('Page not initialized');
  //   return await this.page.locator('[data-test="error-message"]').textContent();
  // }

  // BREAKING: Method signature and implementation changed
  async buildErrorMessage(messages: string[], separator: string = ' | '): Promise<string> {
    if (!Array.isArray(messages)) {
      throw new ValidationError('messages', 'Messages must be an array');
    }
    return messages.filter(msg => msg?.trim()).join(separator);
  }

  // BREAKING: Replaced with options-based method
  async loginWithOptions(options: {
    credentials: LoginCredentials;
    retryCount?: number;
    validateSession?: boolean;
    captureScreenshot?: boolean;
  }): Promise<LoginResult> {
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

  // BREAKING: Removed safeLogin method - use login() with proper error handling

  // BREAKING: loginWithRetry replaced with loginWithOptions
  async loginWithRetry(credentials: LoginCredentials, maxRetries: number = 3): Promise<LoginResult> {
    return await this.loginWithOptions({
      credentials,
      retryCount: maxRetries
    });
  }

  // BREAKING: validateLoginForm now uses new selectors and returns detailed info
  async validateLoginForm(): Promise<{
    isValid: boolean;
    fields: {
      username: boolean;
      password: boolean;
      loginButton: boolean;
      rememberMe?: boolean;
      mfaCode?: boolean;
    };
    errors: string[];
  }> {
    const result = {
      isValid: false,
      fields: {
        username: false,
        password: false,
        loginButton: false
      },
      errors: [] as string[]
    };

    try {
      result.fields.username = await this.page.locator('[data-test="username"]').isVisible();
      result.fields.password = await this.page.locator('[data-test="password"]').isVisible();
      result.fields.loginButton = await this.page.locator('[data-test="login-button"]').isVisible();

      // Check optional fields based on environment
      if (this.config.environment !== 'dev') {
        result.fields.rememberMe = await this.page.locator('[data-test="remember-me"]').isVisible();
        result.fields.mfaCode = await this.page.locator('[data-test="mfa-code"]').isVisible();
      }

      result.isValid = result.fields.username && result.fields.password && result.fields.loginButton;

      if (!result.fields.username) result.errors.push('Username field not found');
      if (!result.fields.password) result.errors.push('Password field not found');
      if (!result.fields.loginButton) result.errors.push('Login button not found');

    } catch (error) {
      result.errors.push(`Form validation failed: ${error.message}`);
    }

    return result;
  }

  // BREAKING: performLogin now returns result and logs properly
  async performLogin(credentials: LoginCredentials): Promise<LoginResult> {
    const startTime = Date.now();

    try {
      console.log(`[LOGIN] Attempting login for user: ${{}}`, credentials.username);

      const result = await this.login(credentials);

      const duration = Date.now() - startTime;
      if (result.success) {
        console.log(`[LOGIN] SUCCESS: Login completed in ${{}}ms for user ${{}}`, duration, credentials.username);
      } else {
        console.error(`[LOGIN] FAILED: Login failed after ${{}}ms for user ${{}}`, duration, credentials.username, {
          errors: result.errors
        });
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[LOGIN] ERROR: Unexpected error after ${{}}ms for user ${{}}`, duration, credentials.username, error);
      throw error;
    }
  }

  // BREAKING: calculateRetryDelay now has proper validation and uses exponential backoff
  calculateRetryDelay(attempt: number, baseDelay: number = 1000): number {
    if (attempt < 1) {
      throw new ValidationError('attempt', 'Attempt must be >= 1');
    }
    if (baseDelay < 100) {
      throw new ValidationError('baseDelay', 'Base delay must be >= 100ms');
    }

    // Exponential backoff: baseDelay * 2^(attempt-1)
    return baseDelay * Math.pow(2, attempt - 1);
  }

  // BREAKING: waitForLogin now uses configuration and validates timeout
  async waitForLogin(customTimeout?: number): Promise<void> {
    const timeout = customTimeout || this.config.timeout;

    // Validate against maximum allowed timeout
    const MAX_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    if (timeout > MAX_TIMEOUT) {
      throw new ValidationError('timeout', `Timeout cannot exceed ${{}}ms`, MAX_TIMEOUT);
    }

    await this.page.waitForSelector('[data-test="login-button"]', {
      timeout,
      state: 'visible'
    });
  }

  // BREAKING: New method for logout
  async logout(): Promise<void> {
    await this.page.click('[data-test="logout-button"]');
    await this.page.waitForURL('**/login', { timeout: this.config.timeout });
  }

  // BREAKING: New method for checking authentication status
  async isAuthenticated(): Promise<boolean> {
    try {
      const currentUrl = this.page.url();
      return !currentUrl.includes('/login');
    } catch {
      return false;
    }
  }

  // BREAKING: New method for getting current user info
  async getCurrentUserInfo(): Promise<User | null> {
    if (!(await this.isAuthenticated())) {
      return null;
    }

    try {
      // Simulate API call to get user info
      return await this.getCurrentUser();
    } catch {
      return null;
    }
  }
}
}

