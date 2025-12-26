// NULL SAFETY: Test configuration with comprehensive null safety violations
// NULL SAFETY: Missing type safety and nullable handling

export class TestConfig {
  // NULL SAFETY: Static properties with potential null values
  private static config: TestConfiguration | null = null;
  private static environment: string | null = null;

  // NULL SAFETY: Method returning nullable configuration
  static getConfig(): TestConfiguration | null {
    // NULL SAFETY: No null check before returning
    if (!this.config) {
      // NULL SAFETY: Loading config without error handling
      this.config = this.loadConfiguration(); // NULL SAFETY: Could return null
    }
    return this.config; // NULL SAFETY: Could be null
  }

  // NULL SAFETY: Private method with unsafe file operations
  private static loadConfiguration(): TestConfiguration | null {
    try {
      // NULL SAFETY: Environment variable access without null checking
      const env = process.env.NODE_ENV || 'development'; // NULL SAFETY: process.env could be null
      this.environment = env; // NULL SAFETY: Assigning potentially null value

      // NULL SAFETY: File path construction with nullable components
      const configPath = `./config/${env}.json`; // NULL SAFETY: env could be null

      // NULL SAFETY: File system operation without proper error handling
      const fs = require('fs');
      const configData = fs.readFileSync(configPath, 'utf8'); // NULL SAFETY: Could throw

      // NULL SAFETY: JSON parsing without validation
      const parsedConfig = JSON.parse(configData); // NULL SAFETY: Could throw or return null

      // NULL SAFETY: Returning parsed config without validation
      return parsedConfig; // NULL SAFETY: Could be null or malformed
    } catch (error) {
      // NULL SAFETY: Silent failure, returning null
      console.warn(`Failed to load config: ${error.message}`); // NULL SAFETY: error could be null
      return null; // NULL SAFETY: Explicit null return
    }
  }

  // NULL SAFETY: Method with nested nullable property access
  static getDatabaseConfig(): DatabaseConfig | null {
    // NULL SAFETY: Getting config without null checking
    const config = this.getConfig(); // NULL SAFETY: Could return null

    // NULL SAFETY: Unsafe property access
    return config?.database; // NULL SAFETY: config could be null, database could be null
  }

  // NULL SAFETY: Method with multiple nullable access patterns
  static getApiConfig(): ApiConfig | null {
    const config = this.getConfig(); // NULL SAFETY: Could return null

    // NULL SAFETY: Deep nested access without safety
    if (config && config.api) { // NULL SAFETY: Basic null checks
      // NULL SAFETY: Still unsafe nested access
      return {
        baseUrl: config.api.baseUrl, // NULL SAFETY: config.api.baseUrl could be null
        timeout: config.api.timeout || 5000, // NULL SAFETY: Silent default
        headers: config.api.headers || {}, // NULL SAFETY: Silent default
        retries: config.api.retries || 3 // NULL SAFETY: Silent default
      };
    }

    // NULL SAFETY: Returning null without logging
    return null;
  }

  // NULL SAFETY: Browser configuration with nullable properties
  static getBrowserConfig(): BrowserConfig | null {
    const config = this.getConfig(); // NULL SAFETY: Could return null

    // NULL SAFETY: Unsafe property access
    const browserConfig = config?.browser; // NULL SAFETY: config could be null

    if (browserConfig) {
      return {
        name: browserConfig.name || 'chromium', // NULL SAFETY: Silent default
        headless: browserConfig.headless !== false, // NULL SAFETY: Complex boolean logic
        viewport: browserConfig.viewport || { width: 1280, height: 720 }, // NULL SAFETY: Silent default
        slowMo: browserConfig.slowMo || 0, // NULL SAFETY: Silent default
        args: browserConfig.args || [] // NULL SAFETY: Silent default
      };
    }

    return null; // NULL SAFETY: Returning null
  }

  // NULL SAFETY: Test data configuration with nullable arrays
  static getTestDataConfig(): TestDataConfig | null {
    const config = this.getConfig(); // NULL SAFETY: Could return null

    // NULL SAFETY: Unsafe nested property access
    return {
      users: config?.testData?.users || [], // NULL SAFETY: Silent default to empty array
      products: config?.testData?.products || [], // NULL SAFETY: Silent default
      scenarios: config?.testData?.scenarios || [] // NULL SAFETY: Silent default
    };
  }

  // NULL SAFETY: Method with environment-specific nullable logic
  static isProduction(): boolean {
    // NULL SAFETY: Environment access without null checking
    const env = this.environment || process.env.NODE_ENV || 'development'; // NULL SAFETY: Multiple nullable sources

    // NULL SAFETY: String comparison with potentially null value
    return env === 'production'; // NULL SAFETY: env could be null
  }

  // NULL SAFETY: Method returning nullable primitive
  static getLogLevel(): string | null {
    const config = this.getConfig(); // NULL SAFETY: Could return null

    // NULL SAFETY: Unsafe property access
    return config?.logging?.level; // NULL SAFETY: Deep nullable access
  }

  // NULL SAFETY: Method with array processing and null safety issues
  static getTestTags(): string[] | null {
    const config = this.getConfig(); // NULL SAFETY: Could return null

    // NULL SAFETY: Unsafe array access
    const tags = config?.testOptions?.tags; // NULL SAFETY: Deep nullable access

    // NULL SAFETY: Array processing without null checks
    if (Array.isArray(tags)) { // NULL SAFETY: Basic type check
      // NULL SAFETY: Still unsafe array operations
      return tags.filter(tag => tag != null); // NULL SAFETY: Filtering nulls but tag could be null
    }

    return []; // NULL SAFETY: Returning empty array instead of null
  }
}

// NULL SAFETY: Interfaces with deeply nested nullable properties
interface TestConfiguration {
  database?: DatabaseConfig | null;
  api?: ApiConfig | null;
  browser?: BrowserConfig | null;
  testData?: TestDataConfig | null;
  logging?: LoggingConfig | null;
  testOptions?: TestOptionsConfig | null;
}

interface DatabaseConfig {
  host: string | null;
  port: number | null;
  database: string | null;
  username: string | null;
  password: string | null;
  ssl?: boolean | null;
  connectionTimeout?: number | null;
}

interface ApiConfig {
  baseUrl: string | null;
  timeout: number | null;
  headers: Record<string, string> | null;
  retries: number | null;
  auth?: {
    type: string | null;
    token: string | null;
    username: string | null;
    password: string | null;
  } | null;
}

interface BrowserConfig {
  name: string | null;
  headless: boolean | null;
  viewport: { width: number; height: number } | null;
  slowMo: number | null;
  args: string[] | null;
}

interface TestDataConfig {
  users: UserData[] | null;
  products: ProductData[] | null;
  scenarios: ScenarioData[] | null;
}

interface LoggingConfig {
  level: string | null;
  format: string | null;
  outputs: string[] | null;
}

interface TestOptionsConfig {
  tags: string[] | null;
  retries: number | null;
  timeout: number | null;
  parallel: boolean | null;
}

interface UserData {
  id: string | null;
  username: string | null;
  password: string | null;
  role: string | null;
  isActive: boolean | null;
}

interface ProductData {
  id: string | null;
  name: string | null;
  price: number | null;
  category: string | null;
  inStock: boolean | null;
}

interface ScenarioData {
  name: string | null;
  description: string | null;
  steps: string[] | null;
  expectedResult: any | null;
}
