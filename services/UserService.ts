// PR #10 - MICROSERVICES MIGRATION: Breaking monolithic UserService into microservices
// This PR demonstrates complex architectural changes with high business impact

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  subscription: SubscriptionInfo;
  security: SecuritySettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
}

export interface SubscriptionInfo {
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  billingCycle: 'monthly' | 'yearly';
}

// BREAKING CHANGE: Extracted to separate microservice
export class UserProfileService {
  // HIGH IMPACT: Cross-service data migration required
  async migrateUserProfiles(): Promise<void> {
    // Database migration affecting millions of users
    const users = await this.getAllUsers();
    for (const user of users) {
      await this.migrateToNewService(user);
    }
  }

  // SECURITY RISK: Data migration with PII exposure
  private async migrateToNewService(user: any): Promise<void> {
    // Direct database access during migration
    const { Client } = require('pg');
    const client = new Client(process.env.USER_DB_CONNECTION);

    try {
      await client.connect();
      await client.query(
        'INSERT INTO user_profiles_new (id, email, name, preferences) VALUES ($1, $2, $3, $4)',
        [user.id, user.email, user.name, JSON.stringify(user.preferences)]
      );
    } finally {
      await client.end();
    }
  }

  private async getAllUsers(): Promise<any[]> {
    // Fetch all users - could be millions
    const { Client } = require('pg');
    const client = new Client(process.env.USER_DB_CONNECTION);

    try {
      await client.connect();
      const result = await client.query('SELECT * FROM users');
      return result.rows;
    } finally {
      await client.end();
    }
  }
}

// BREAKING CHANGE: Extracted to separate microservice
export class UserSubscriptionService {
  // HIGH IMPACT: Subscription management with billing integration
  async processSubscriptionUpgrade(userId: string, newPlan: string): Promise<void> {
    const user = await this.getUserSubscription(userId);

    // Complex business logic for subscription changes
    if (user.plan !== newPlan) {
      await this.validateUpgradeEligibility(user);
      await this.calculateProration(user, newPlan);
      await this.processBillingChange(user, newPlan);
      await this.updateSubscription(userId, newPlan);
      await this.notifyUserOfChange(user);
    }
  }

  // BUSINESS IMPACT: Revenue implications
  private async calculateProration(currentPlan: any, newPlan: string): Promise<number> {
    const pricing = {
      'free': 0,
      'premium': 29.99,
      'enterprise': 99.99
    };

    const currentPrice = pricing[currentPlan.plan as keyof typeof pricing];
    const newPrice = pricing[newPlan as keyof typeof pricing];
    const daysRemaining = 15; // Assume mid-month

    return (newPrice - currentPrice) * (daysRemaining / 30);
  }

  private async getUserSubscription(userId: string): Promise<any> {
    // Database query
    const { Client } = require('pg');
    const client = new Client(process.env.USER_DB_CONNECTION);

    try {
      await client.connect();
      const result = await client.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  private async validateUpgradeEligibility(user: any): Promise<void> {
    if (user.status === 'suspended') {
      throw new Error('Cannot upgrade suspended account');
    }
  }

  private async processBillingChange(user: any, newPlan: string): Promise<void> {
    // Integration with payment processor
    console.log(`Processing billing change for user ${user.id} to ${newPlan}`);
  }

  private async updateSubscription(userId: string, newPlan: string): Promise<void> {
    const { Client } = require('pg');
    const client = new Client(process.env.USER_DB_CONNECTION);

    try {
      await client.connect();
      await client.query(
        'UPDATE subscriptions SET plan = $1, updated_at = NOW() WHERE user_id = $2',
        [newPlan, userId]
      );
    } finally {
      await client.end();
    }
  }

  private async notifyUserOfChange(user: any): Promise<void> {
    // Email notification service
    console.log(`Notifying user ${user.email} of subscription change`);
  }
}

// BREAKING CHANGE: Extracted to separate microservice
export class UserSecurityService {
  // HIGH IMPACT: Security settings with compliance requirements
  async updateSecuritySettings(userId: string, settings: SecuritySettings): Promise<void> {
    // Validate security settings
    await this.validateSecuritySettings(settings);

    // Update security preferences
    await this.updateUserSecurity(userId, settings);

    // Audit logging for compliance
    await this.logSecurityChange(userId, settings);

    // Notify security team if high-risk changes
    if (settings.twoFactorEnabled === false) {
      await this.notifySecurityTeam(userId, '2FA disabled');
    }
  }

  private async validateSecuritySettings(settings: SecuritySettings): Promise<void> {
    if (!settings.passwordMinLength || settings.passwordMinLength < 8) {
      throw new Error('Password minimum length must be at least 8 characters');
    }
  }

  private async updateUserSecurity(userId: string, settings: SecuritySettings): Promise<void> {
    const { Client } = require('pg');
    const client = new Client(process.env.USER_DB_CONNECTION);

    try {
      await client.connect();
      await client.query(
        'UPDATE user_security SET settings = $1, updated_at = NOW() WHERE user_id = $2',
        [JSON.stringify(settings), userId]
      );
    } finally {
      await client.end();
    }
  }

  private async logSecurityChange(userId: string, settings: SecuritySettings): Promise<void> {
    // Compliance audit logging
    console.log(`Security settings updated for user ${userId}:`, settings);
  }

  private async notifySecurityTeam(userId: string, reason: string): Promise<void> {
    // Security monitoring alert
    console.log(`SECURITY ALERT: ${reason} for user ${userId}`);
  }
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordMinLength: number;
  sessionTimeout: number;
  loginAttempts: number;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}
