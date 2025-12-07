// HARDCODED VALUES: Should use environment variables
export class ConfigHelper {
  static readonly BASE_URL = 'https://www.saucedemo.com';
  static readonly TIMEOUT = 30000; // Magic number
  static readonly RETRY_COUNT = 3; // Magic number
  
  // SECURITY: Hardcoded credentials
  static readonly DEFAULT_USER = {
    username: 'standard_user',
    password: 'secret_sauce'
  };

  // MISSING DOCUMENTATION
  static getApiEndpoint(endpoint: string) {
    return `${this.BASE_URL}/api/${endpoint}`;
  }

  // INEFFICIENT: Creates new object each time
  static getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
}

