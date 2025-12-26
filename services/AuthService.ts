// BREAKING CHANGE: Added new required interface
export interface AuthOptions {
  rememberMe: boolean;
  multiFactorRequired: boolean;
  sessionTimeout: number;
}

// BREAKING CHANGE: New interface replacing boolean return type
export interface ValidationResult {
  isValid: boolean;
  reason: string;
  timestamp: number;
}

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

  // BREAKING CHANGE: Added required options parameter
  async authenticate(username: string, password: string, options?: AuthOptions) {
    const API_KEY = 'sk-live-1234567890abcdef'; // Hardcoded API key
    // Authentication logic
    this.token = 'generated-token';
    return this.token;
  }

  // BREAKING CHANGE: Changed return type from boolean to ValidationResult
  // BREAKING CHANGE: Added required strict parameter
  async validateToken(token: string, strict: boolean = false): Promise<ValidationResult> {
    const isValid = token !== null && token.length > 0;
    return {
      isValid,
      reason: isValid ? 'valid' : 'empty_token',
      timestamp: Date.now()
    };
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

// BREAKING CHANGE: Changed parameter type from union to enum
export enum AuthType {
  STANDARD = 'standard',
  ADMIN = 'admin',
  ENTERPRISE = 'enterprise'  // New type added
}

// DESIGN PATTERN: Factory Pattern (good)
export class AuthServiceFactory {
  // BREAKING CHANGE: Parameter type changed from string union to enum
  static create(type: AuthType, config?: AuthConfig): AuthService {
    if (type === AuthType.ADMIN) {
      return AuthService.getInstance();
    }
    return AuthService.getInstance();
  }
}

// BREAKING CHANGE: New required interface
export interface AuthConfig {
  region: string;
  environment: 'dev' | 'staging' | 'prod';
}

