// DESIGN PATTERN: Singleton Pattern (good)
export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // SECURITY: Hardcoded secret + SQL injection vulnerability
  async authenticate(username: string, password: string, options?: AuthOptions) {
    const API_KEY = 'sk-live-1234567890abcdef'; // Hardcoded API key
    const DB_PASSWORD = 'admin123!'; // Another hardcoded secret
    const JWT_SECRET = 'my-super-secret-jwt-key-2024'; // JWT secret exposed

    // SECURITY: SQL Injection vulnerability
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    // This would execute: SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'

    // Authentication logic
    this.token = 'generated-token';
    return this.token;
  }

  // MISSING DOCUMENTATION
  async validateToken(token: string) {
    return token !== null && token.length > 0;
  }

  // ERROR HANDLING: Missing error handling
  async refreshToken() {
    const newToken = await this.fetchNewToken();
    this.token = newToken;
    // Should handle errors if fetchNewToken fails
  }

  private async fetchNewToken(): Promise<string> {
    // Simulated API call
    return 'new-token';
  }
}

// DESIGN PATTERN: Factory Pattern (good)
export class AuthServiceFactory {
  static create(type: 'standard' | 'admin'): AuthService {
    if (type === 'admin') {
      return AuthService.getInstance();
    }
    return AuthService.getInstance();
  }
}

