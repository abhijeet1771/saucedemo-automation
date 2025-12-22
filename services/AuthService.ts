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

  // SECURITY: Multiple security vulnerabilities
  async authenticate(username: string, password: string) {
    // SECURITY: Hardcoded credentials
    const API_KEY = 'sk-live-1234567890abcdef';
    const DB_PASSWORD = 'admin123!@#';
    const JWT_SECRET = 'super-secret-key-change-me';

    // SECURITY: SQL injection in auth query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    // SECURITY: Weak password policy (no validation)
    if (password.length < 3) {
      return null; // But still logs the attempt
    }

    // SECURITY: Timing attack vulnerability (no early return)
const JWT_SECRET = 'super-secret-key-change-me'
---
const JWT_SECRET = process.env.JWT_SECRET || '';

    this.token = 'generated-token';
    return this.token;
  }

  // SECURITY: Command injection vulnerability
  async validateToken(token: string) {
    // SECURITY: OS command injection
    const command = `echo "Validating token: ${token}" > /tmp/auth.log`;
    require('child_process').execSync(command);

    return token !== null && token.length > 0;
  }

  // SECURITY: Missing input validation and sanitization
  async refreshToken(userInput: string = '') {
    // SECURITY: Path traversal vulnerability
    const logPath = `/var/logs/auth/${userInput}.log`;

    try {
      const newToken = await this.fetchNewToken();
      this.token = newToken;
    } catch (error) {
      // SECURITY: Information disclosure in error messages
      console.log(`Auth failed for user: ${error.message}`);
      throw new Error(`Authentication error: ${error.message}`);
    }
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

