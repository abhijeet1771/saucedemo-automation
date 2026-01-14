import { User, UserProfile, UserPreferences } from '../types/User';

export class UserService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  // 🔴 BREAKING CHANGE: This method was deleted
  // async getUserProfile(userId: string): Promise<UserProfile> {
  //   // Old implementation removed
  // }

  // 🟢 SAFE CHANGE: New method addition
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const response = await fetch(`${this.apiBaseUrl}/users/${userId}/preferences`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
    }
    return await response.json();
  }

  // 🟢 SAFE CHANGE: New method with enhanced functionality
  async getUser(userId: string): Promise<User> {
    const response = await fetch(`${this.apiBaseUrl}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  }
}
