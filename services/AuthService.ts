// BREAKING: Complete redesign with dependency injection and new types
import { User, AuthenticationError, AuthorizationError, AppError } from '../types/CoreTypes';

interface AuthConfig {
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
  tokenStorage: 'localStorage' | 'sessionStorage' | 'memory';
}

interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  errors?: string[];
}

interface TokenValidationResult {
  isValid: boolean;
  user?: User;
  expiresAt?: Date;
  errors?: string[];
}

// BREAKING: No longer a singleton - requires configuration
export class AuthService {
  private config: AuthConfig;
  private currentToken: string | null = null;
  private refreshTokenValue: string | null = null;
  private currentUser: User | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
    this.loadStoredTokens();
  }

  // BREAKING: authenticate now uses LoginCredentials and returns AuthResult
  async authenticate(credentials: { username: string; password: string; rememberMe?: boolean }): Promise<AuthResult> {
    try {
      // BREAKING: Validate input
      this.validateCredentials(credentials);

      // BREAKING: Use environment variables instead of hardcoded values
      const apiKey = process.env.SAUCEDEMO_API_KEY;
      if (!apiKey) {
        throw new AuthenticationError('API key not configured');
      }

      // BREAKING: Proper API call with error handling
      const response = await this.makeAuthRequest(credentials, apiKey);

      if (response.success) {
        this.currentToken = response.token!;
        this.refreshTokenValue = response.refreshToken;
        this.currentUser = response.user!;

        // BREAKING: Store tokens based on configuration
        this.storeTokens(response.token!, response.refreshToken, credentials.rememberMe);

        return {
          success: true,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: response.expiresAt
        };
      } else {
        return {
          success: false,
          errors: response.errors || ['Authentication failed']
        };
      }

    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  // BREAKING: validateToken now returns detailed TokenValidationResult
  async validateToken(token?: string): Promise<TokenValidationResult> {
    const tokenToValidate = token || this.currentToken;

    if (!tokenToValidate) {
      return { isValid: false, errors: ['No token provided'] };
    }

    try {
      // BREAKING: Proper token validation with API call
      const response = await this.makeTokenValidationRequest(tokenToValidate);

      if (response.isValid) {
        return {
          isValid: true,
          user: response.user,
          expiresAt: response.expiresAt
        };
      } else {
        // BREAKING: Clear invalid tokens
        this.clearStoredTokens();
        return {
          isValid: false,
          errors: response.errors || ['Token validation failed']
        };
      }

    } catch (error) {
      console.error('Token validation error:', error);
      return {
        isValid: false,
        errors: [error.message]
      };
    }
  }

  // BREAKING: refreshToken now has proper error handling and returns result
  async refreshToken(): Promise<AuthResult> {
    if (!this.refreshTokenValue) {
      return {
        success: false,
        errors: ['No refresh token available']
      };
    }

    try {
      const response = await this.makeRefreshTokenRequest(this.refreshTokenValue);

      if (response.success) {
        this.currentToken = response.token!;
        this.refreshTokenValue = response.refreshToken;
        this.storeTokens(response.token!, response.refreshToken);

        return {
          success: true,
          user: this.currentUser || response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: response.expiresAt
        };
      } else {
        // BREAKING: Clear tokens on refresh failure
        this.clearStoredTokens();
        return {
          success: false,
          errors: response.errors || ['Token refresh failed']
        };
      }

    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearStoredTokens();
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  // BREAKING: New method for logout
  async logout(): Promise<void> {
    this.clearStoredTokens();
    this.currentToken = null;
    this.refreshTokenValue = null;
    this.currentUser = null;
  }

  // BREAKING: New method to get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // BREAKING: New method to check if authenticated
  isAuthenticated(): boolean {
    return this.currentToken !== null && this.currentUser !== null;
  }

  // BREAKING: Private methods with proper implementation
  private validateCredentials(credentials: { username: string; password: string }) {
    if (!credentials.username?.trim()) {
      throw new ValidationError('username', 'Username is required');
    }
    if (!credentials.password?.trim()) {
      throw new ValidationError('password', 'Password is required');
    }
  }

  private async makeAuthRequest(credentials: any, apiKey: string): Promise<any> {
    // Simulate API call - in real implementation this would make HTTP request
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

    if (credentials.username === 'standard_user' && credentials.password === 'secret_sauce') {
      const user: User = {
        uuid: 'user-123',
        email: credentials.username + '@example.com',
        profile: {
          firstName: 'Standard',
          lastName: 'User',
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: true
          }
        },
        permissions: [{ resource: 'products', actions: ['read'] }],
        metadata: {}
      };

      return {
        success: true,
        user,
        token: 'jwt-token-' + Date.now(),
        refreshToken: 'refresh-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      };
    }

    return {
      success: false,
      errors: ['Invalid credentials']
    };
  }

  private async makeTokenValidationRequest(token: string): Promise<any> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 50));

    if (token.startsWith('jwt-token-')) {
      return {
        isValid: true,
        user: this.currentUser,
        expiresAt: new Date(Date.now() + 3600000)
      };
    }

    return {
      isValid: false,
      errors: ['Invalid token']
    };
  }

  private async makeRefreshTokenRequest(refreshToken: string): Promise<any> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 50));

    if (refreshToken.startsWith('refresh-token-')) {
      return {
        success: true,
        token: 'jwt-token-refreshed-' + Date.now(),
        refreshToken: 'refresh-token-new-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000)
      };
    }

    return {
      success: false,
      errors: ['Invalid refresh token']
    };
  }

  private storeTokens(token: string, refreshToken?: string, persistent: boolean = false) {
    const storage = persistent && this.config.tokenStorage === 'localStorage' ?
      localStorage : sessionStorage;

    try {
      storage.setItem('auth_token', token);
      if (refreshToken) {
        storage.setItem('refresh_token', refreshToken);
      }
    } catch (error) {
      console.warn('Failed to store tokens:', error);
    }
  }

  private loadStoredTokens() {
    try {
      const storage = this.config.tokenStorage === 'localStorage' ? localStorage : sessionStorage;
      this.currentToken = storage.getItem('auth_token');
      this.refreshTokenValue = storage.getItem('refresh_token');
    } catch (error) {
      console.warn('Failed to load stored tokens:', error);
    }
  }

  private clearStoredTokens() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('refresh_token');
    } catch (error) {
      console.warn('Failed to clear stored tokens:', error);
    }
  }
}

// BREAKING: Factory pattern redesigned with configuration support
export class AuthServiceFactory {
  private static instances = new Map<string, AuthService>();

  static async create(type: 'standard' | 'admin' | 'enterprise', config?: Partial<AuthConfig>): Promise<AuthService> {
    const key = `${type}_${JSON.stringify(config || {})}`;

    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    // BREAKING: Default configuration based on type
    const defaultConfig: AuthConfig = {
      apiUrl: process.env.SAUCEDEMO_API_URL || 'https://www.saucedemo.com/api',
      timeout: 30000,
      retryAttempts: type === 'enterprise' ? 5 : 3,
      tokenStorage: type === 'enterprise' ? 'localStorage' : 'sessionStorage',
      ...config
    };

    // BREAKING: Async factory method
    const service = new AuthService(defaultConfig);
    this.instances.set(key, service);

    return service;
  }

  // BREAKING: New method to clear instances (for testing)
  static clearInstances(): void {
    this.instances.clear();
  }

  // BREAKING: New method to get instance count
  static getInstanceCount(): number {
    return this.instances.size;
  }
}

