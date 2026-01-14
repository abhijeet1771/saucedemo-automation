import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // 🔴 BREAKING CHANGE: Added required parameter 'rememberMe'
  async login(username: string, password: string, rememberMe: boolean): Promise<void> {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    
    // New feature: Remember me checkbox
    if (rememberMe) {
      await this.page.check('#remember-me');
    }
    
    await this.page.click('#login-button');
    await this.page.waitForURL('**/inventory.html');
  }

  // 🟢 SAFE CHANGE: New method addition
  async logout(): Promise<void> {
    await this.page.click('#react-burger-menu-btn');
    await this.page.click('#logout_sidebar_link');
    await this.page.waitForURL('**/');
  }

  // 🟢 SAFE CHANGE: Implementation improvement with error handling
  async loginWithErrorHandling(username: string, password: string): Promise<boolean> {
    try {
      await this.login(username, password, false);
      return true;
    } catch (error) {
      console.error(`Login failed: ${error}`);
      return false;
    }
  }
}
