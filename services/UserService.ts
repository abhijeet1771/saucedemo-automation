// ARCHITECTURE VIOLATION: Circular dependency with OrderService
// ARCHITECTURE VIOLATION: Tight coupling between services
import { OrderService, OrderNotificationService } from './OrderService';

export class UserService {
  // ARCHITECTURE VIOLATION: Direct instantiation of other services
  private orderService = new OrderService();
  private notificationService = new OrderNotificationService();

  // ARCHITECTURE VIOLATION: Missing dependency injection
  constructor() {
    // Direct service instantiation creates tight coupling
  }

  // ARCHITECTURE VIOLATION: Service doing too many things
  async registerUser(userData: any): Promise<any> {
    // Responsibility 1: User creation
    const user = await this.createUser(userData);

    // Responsibility 2: Welcome email (should be separate service)
    await this.sendWelcomeEmail(user.email);

    // Responsibility 3: Initial order setup (tight coupling)
    await this.createWelcomeOrder(user.id);

    // Responsibility 4: User preferences (should be separate)
    await this.setupUserPreferences(user.id);

    return user;
  }

  // ARCHITECTURE VIOLATION: Direct database access in service
  private async createUser(userData: any): Promise<any> {
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      const query = `
        INSERT INTO users (email, password, name, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING user_id, email, name
      `;
      const result = await client.query(query, [userData.email, userData.password, userData.name]);
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: Direct email sending in user service
  private async sendWelcomeEmail(email: string): Promise<void> {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome!',
      html: '<h1>Welcome to our platform!</h1>'
    });
  }

  // ARCHITECTURE VIOLATION: User service directly calling order service
  // This creates circular dependency: UserService -> OrderService -> UserService (through notifications)
  private async createWelcomeOrder(userId: number): Promise<void> {
    const welcomeItems = [
      { productId: 'welcome-kit', quantity: 1, price: 0, name: 'Welcome Kit' }
    ];

    // ARCHITECTURE VIOLATION: Direct service call creates tight coupling
    await this.orderService.createOrder(userId, welcomeItems);

    // ARCHITECTURE VIOLATION: Direct notification service call
    await this.notificationService.notifyOrderStatus(1); // Hardcoded order ID
  }

  // ARCHITECTURE VIOLATION: User service managing preferences (different concern)
  private async setupUserPreferences(userId: number): Promise<void> {
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      await client.query(`
        INSERT INTO user_preferences (user_id, theme, language, notifications)
        VALUES ($1, 'light', 'en', true)
      `, [userId]);
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: Singleton pattern creates global state
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // ARCHITECTURE VIOLATION: Service directly handling authentication
  async authenticateUser(email: string, password: string): Promise<any> {
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );

      if (result.rows.length > 0) {
        // ARCHITECTURE VIOLATION: Authentication service updating user last login
        await client.query(
          'UPDATE users SET last_login = NOW() WHERE user_id = $1',
          [result.rows[0].user_id]
        );

        return result.rows[0];
      }
      return null;
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: User service handling password reset (different concern)
  async resetPassword(email: string): Promise<void> {
    // Generate token
    const resetToken = Math.random().toString(36).substring(2);

    // Store token (direct DB access)
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      await client.query(
        'UPDATE users SET reset_token = $1, reset_expires = NOW() + INTERVAL \'1 hour\' WHERE email = $2',
        [resetToken, email]
      );
    } finally {
      await client.end();
    }

    // Send email (direct email sending)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Reset your password: <a href="/reset/${resetToken}">Reset Password</a></p>`
    });
  }
}

// ARCHITECTURE VIOLATION: Cross-cutting concerns mixed with business logic
export class UserAuditService {
  // ARCHITECTURE VIOLATION: Direct database access for auditing
  async logUserAction(userId: number, action: string, details: any): Promise<void> {
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      await client.query(`
        INSERT INTO user_audit (user_id, action, details, timestamp)
        VALUES ($1, $2, $3, NOW())
      `, [userId, action, JSON.stringify(details)]);
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: Audit service doing reporting (different concern)
  async generateUserReport(userId: number): Promise<any> {
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      const userResult = await client.query('SELECT * FROM users WHERE user_id = $1', [userId]);
      const auditResult = await client.query('SELECT * FROM user_audit WHERE user_id = $1', [userId]);

      return {
        user: userResult.rows[0],
        auditTrail: auditResult.rows,
        reportGenerated: new Date()
      };
    } finally {
      await client.end();
    }
  }
}
