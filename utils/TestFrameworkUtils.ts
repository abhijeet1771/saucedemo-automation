// FRAMEWORK VIOLATION: Test utilities with framework-specific anti-patterns
// FRAMEWORK VIOLATION: Poor test data management, isolation issues, CI/CD problems

export class TestDataManager {
  // FRAMEWORK VIOLATION: Global shared state across tests
  private static sharedTestData: Map<string, any> = new Map();

  // FRAMEWORK VIOLATION: Static method with side effects
  static setSharedData(key: string, value: any): void {
    this.sharedTestData.set(key, value);
  }

  // FRAMEWORK VIOLATION: Global state access
  static getSharedData(key: string): any {
    return this.sharedTestData.get(key);
  }

  // FRAMEWORK VIOLATION: No cleanup mechanism
  static clearSharedData(): void {
    // FRAMEWORK VIOLATION: Incomplete cleanup
    this.sharedTestData.clear();
  }

  // FRAMEWORK VIOLATION: File-based test data (slow, shared state)
  static async loadTestDataFromFile(fileName: string): Promise<any> {
    const fs = require('fs').promises;
    const path = require('path');

    // FRAMEWORK VIOLATION: Synchronous file I/O in tests
    const filePath = path.join(process.cwd(), 'test-data', fileName);
    const data = await fs.readFile(filePath, 'utf8');

    return JSON.parse(data);
  }

  // FRAMEWORK VIOLATION: Database test data (shared state, slow)
  static async setupDatabaseTestData(): Promise<void> {
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
      // FRAMEWORK VIOLATION: Direct database modifications in test utilities
      await client.query('DELETE FROM test_orders');
      await client.query('DELETE FROM test_users');

      // FRAMEWORK VIOLATION: Inserting shared test data
      await client.query(`
        INSERT INTO test_users (id, email, name) VALUES
        (1, 'test@example.com', 'Test User'),
        (2, 'admin@example.com', 'Admin User')
      `);

      await client.query(`
        INSERT INTO test_orders (id, user_id, total) VALUES
        (1, 1, 29.99),
        (2, 2, 49.99)
      `);
    } finally {
      await client.end();
    }
  }

  // FRAMEWORK VIOLATION: No teardown method
  static async cleanupDatabaseTestData(): Promise<void> {
    // FRAMEWORK VIOLATION: Incomplete cleanup
    console.log('Database cleanup would happen here');
  }
}

export class ParallelExecutionManager {
  // FRAMEWORK VIOLATION: Global state for parallel execution
  private static activeTests: Set<string> = new Set();
  private static readonly MAX_CONCURRENT_TESTS = 5;

  // FRAMEWORK VIOLATION: Manual parallel execution control
  static async acquireTestSlot(testId: string): Promise<boolean> {
    if (this.activeTests.size >= this.MAX_CONCURRENT_TESTS) {
      return false;
    }

    this.activeTests.add(testId);
    return true;
  }

  // FRAMEWORK VIOLATION: No proper cleanup
  static releaseTestSlot(testId: string): void {
    this.activeTests.delete(testId);
  }

  // FRAMEWORK VIOLATION: Shared resources in parallel execution
  private static browserInstances: any[] = [];

  static async getBrowserInstance(): Promise<any> {
    // FRAMEWORK VIOLATION: Shared browser instances across tests
    if (this.browserInstances.length === 0) {
      const { chromium } = require('playwright');
      const browser = await chromium.launch();
      this.browserInstances.push(browser);
    }

    return this.browserInstances[0];
  }

  // FRAMEWORK VIOLATION: No browser cleanup
  static async cleanupBrowserInstances(): Promise<void> {
    // FRAMEWORK VIOLATION: Incomplete cleanup
    for (const browser of this.browserInstances) {
      await browser.close();
    }
    this.browserInstances = [];
  }
}

export class CIEnvironmentManager {
  // FRAMEWORK VIOLATION: Environment-specific logic scattered throughout
  static isCIEnvironment(): boolean {
    // FRAMEWORK VIOLATION: Multiple ways to detect CI
    return !!(
      process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.BUILD_NUMBER ||
      process.env.CIRCLECI ||
      process.env.TRAVIS ||
      process.env.GITHUB_ACTIONS
    );
  }

  // FRAMEWORK VIOLATION: CI-specific test behavior
  static shouldSkipSlowTests(): boolean {
    if (this.isCIEnvironment()) {
      // FRAMEWORK VIOLATION: Skipping tests based on environment
      return process.env.SKIP_SLOW_TESTS === 'true';
    }
    return false;
  }

  // FRAMEWORK VIOLATION: Different timeouts for different environments
  static getTestTimeout(): number {
    if (this.isCIEnvironment()) {
      return 30000; // Shorter timeout in CI
    }
    return 60000; // Longer timeout locally
  }

  // FRAMEWORK VIOLATION: Environment-specific browser config
  static getBrowserConfig(): any {
    const baseConfig = {
      headless: true,
      slowMo: 0
    };

    if (this.isCIEnvironment()) {
      // FRAMEWORK VIOLATION: CI-specific browser config
      return {
        ...baseConfig,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // Problematic in CI
          '--disable-gpu'
        ]
      };
    }

    return baseConfig;
  }

  // FRAMEWORK VIOLATION: CI-specific reporting
  static async reportTestResults(results: any[]): Promise<void> {
    if (this.isCIEnvironment()) {
      // FRAMEWORK VIOLATION: Different reporting in CI
      console.log('::group::Test Results');
      results.forEach(result => {
        console.log(`::${result.passed ? 'notice' : 'error'}::${result.name}`);
      });
      console.log('::endgroup::');
    } else {
      // FRAMEWORK VIOLATION: Console logging locally
      console.table(results);
    }
  }
}

export class ScreenshotManager {
  // FRAMEWORK VIOLATION: Global screenshot storage
  private static screenshots: Map<string, Buffer> = new Map();
  private static screenshotCounter = 0;

  // FRAMEWORK VIOLATION: Synchronous screenshot taking
  static async takeScreenshot(page: any, name: string): Promise<string> {
    // FRAMEWORK VIOLATION: Hardcoded screenshot naming
    const fileName = `${name}-${Date.now()}.png`;

    try {
      // FRAMEWORK VIOLATION: No error handling for screenshot failures
      const screenshot = await page.screenshot({ fullPage: true });

      // FRAMEWORK VIOLATION: Storing screenshots in memory (memory leak)
      this.screenshots.set(fileName, screenshot);
      this.screenshotCounter++;

      return fileName;
    } catch (error) {
      // FRAMEWORK VIOLATION: Silent failure
      console.warn(`Screenshot failed for ${name}:`, error);
      return 'failed-screenshot.png';
    }
  }

  // FRAMEWORK VIOLATION: No cleanup method
  static getScreenshotCount(): number {
    return this.screenshotCounter;
  }

  // FRAMEWORK VIOLATION: Direct file system access in tests
  static async saveScreenshotsToDisk(): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    const screenshotDir = path.join(process.cwd(), 'test-screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });

    // FRAMEWORK VIOLATION: Synchronous file operations
    for (const [fileName, buffer] of this.screenshots) {
      const filePath = path.join(screenshotDir, fileName);
      await fs.writeFile(filePath, buffer);
    }

    // FRAMEWORK VIOLATION: No cleanup after saving
  }
}

export class TestRetryManager {
  // FRAMEWORK VIOLATION: Global retry state
  private static retryCounts: Map<string, number> = new Map();

  // FRAMEWORK VIOLATION: Manual retry logic
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    testName: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();

        // FRAMEWORK VIOLATION: Reset retry count on success
        this.retryCounts.delete(testName);

        return result;
      } catch (error) {
        lastError = error;

        // FRAMEWORK VIOLATION: Track retry counts globally
        const currentCount = this.retryCounts.get(testName) || 0;
        this.retryCounts.set(testName, currentCount + 1);

        if (attempt < maxRetries) {
          // FRAMEWORK VIOLATION: Fixed delay between retries
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw new Error(`${testName} failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  // FRAMEWORK VIOLATION: Global retry statistics
  static getRetryStatistics(): any {
    const stats: any = {};
    let totalRetries = 0;

    for (const [testName, count] of this.retryCounts) {
      stats[testName] = count;
      totalRetries += count;
    }

    stats.totalRetries = totalRetries;
    return stats;
  }
}

export class NetworkInterceptionManager {
  // FRAMEWORK VIOLATION: Global network interception state
  private static interceptedRequests: any[] = [];
  private static interceptedResponses: any[] = [];

  // FRAMEWORK VIOLATION: Manual request interception
  static setupNetworkInterception(page: any): void {
    // FRAMEWORK VIOLATION: Intercepting all requests (performance impact)
    page.route('**/*', (route: any) => {
      const request = {
        url: route.request().url(),
        method: route.request().method(),
        timestamp: Date.now()
      };

      // FRAMEWORK VIOLATION: Storing all requests in memory
      this.interceptedRequests.push(request);

      // FRAMEWORK VIOLATION: Generic interception logic
      if (request.url.includes('/api/')) {
        // FRAMEWORK VIOLATION: Delaying API calls randomly
        setTimeout(() => {
          route.continue();
        }, Math.random() * 1000);
      } else {
        route.continue();
      }
    });

    // FRAMEWORK VIOLATION: Intercepting all responses
    page.on('response', (response: any) => {
      const responseData = {
        url: response.url(),
        status: response.status(),
        timestamp: Date.now()
      };

      // FRAMEWORK VIOLATION: Storing all responses in memory
      this.interceptedResponses.push(responseData);
    });
  }

  // FRAMEWORK VIOLATION: Exposing internal state
  static getInterceptedRequests(): any[] {
    return this.interceptedRequests;
  }

  static getInterceptedResponses(): any[] {
    return this.interceptedResponses;
  }

  // FRAMEWORK VIOLATION: No cleanup mechanism
  static clearInterceptions(): void {
    this.interceptedRequests = [];
    this.interceptedResponses = [];
  }
}

export class PerformanceMonitoringManager {
  // FRAMEWORK VIOLATION: Global performance tracking
  private static performanceMetrics: Map<string, any[]> = new Map();

  // FRAMEWORK VIOLATION: Manual performance tracking
  static startPerformanceTracking(testName: string): void {
    const startTime = Date.now();
    const metrics = this.performanceMetrics.get(testName) || [];
    metrics.push({ startTime, type: 'start' });
    this.performanceMetrics.set(testName, metrics);
  }

  // FRAMEWORK VIOLATION: Manual performance tracking
  static endPerformanceTracking(testName: string): number {
    const endTime = Date.now();
    const metrics = this.performanceMetrics.get(testName) || [];
    const lastMetric = metrics[metrics.length - 1];

    if (lastMetric && lastMetric.type === 'start') {
      const duration = endTime - lastMetric.startTime;
      lastMetric.duration = duration;
      lastMetric.type = 'completed';
      return duration;
    }

    return 0;
  }

  // FRAMEWORK VIOLATION: Memory-intensive storage
  static getPerformanceReport(): any {
    const report: any = {};

    for (const [testName, metrics] of this.performanceMetrics) {
      const completedMetrics = metrics.filter(m => m.type === 'completed');
      const totalDuration = completedMetrics.reduce((sum, m) => sum + m.duration, 0);
      const averageDuration = completedMetrics.length > 0 ? totalDuration / completedMetrics.length : 0;

      report[testName] = {
        totalRuns: metrics.length,
        completedRuns: completedMetrics.length,
        averageDuration,
        totalDuration
      };
    }

    return report;
  }

  // FRAMEWORK VIOLATION: No cleanup
  static clearPerformanceMetrics(): void {
    this.performanceMetrics.clear();
  }
}

// FRAMEWORK VIOLATION: Global test lifecycle manager
export class GlobalTestLifecycleManager {
  // FRAMEWORK VIOLATION: Global test state
  private static testStartTime: number = 0;
  private static activeTestCount: number = 0;
  private static failedTests: string[] = [];

  // FRAMEWORK VIOLATION: Global beforeAll equivalent
  static initializeGlobalTestEnvironment(): void {
    this.testStartTime = Date.now();
    console.log('Global test environment initialized');

    // FRAMEWORK VIOLATION: Setting global process state
    process.env.TEST_MODE = 'active';

    // FRAMEWORK VIOLATION: Global resource allocation
    TestDataManager.setSharedData('globalInit', true);
  }

  // FRAMEWORK VIOLATION: Global afterAll equivalent
  static cleanupGlobalTestEnvironment(): void {
    const duration = Date.now() - this.testStartTime;
    console.log(`Global test environment cleaned up after ${duration}ms`);

    // FRAMEWORK VIOLATION: Global resource cleanup
    TestDataManager.clearSharedData();
    ParallelExecutionManager.cleanupBrowserInstances();

    // FRAMEWORK VIOLATION: Global reporting
    if (this.failedTests.length > 0) {
      console.error(`Failed tests: ${this.failedTests.join(', ')}`);
    }
  }

  // FRAMEWORK VIOLATION: Global test tracking
  static registerTestStart(testName: string): void {
    this.activeTestCount++;
    console.log(`Test started: ${testName} (Active: ${this.activeTestCount})`);
  }

  // FRAMEWORK VIOLATION: Global test tracking
  static registerTestEnd(testName: string, passed: boolean): void {
    this.activeTestCount--;

    if (!passed) {
      this.failedTests.push(testName);
    }

    console.log(`Test ended: ${testName} (${passed ? 'PASSED' : 'FAILED'})`);
  }

  // FRAMEWORK VIOLATION: Global state access
  static getGlobalTestState(): any {
    return {
      startTime: this.testStartTime,
      activeTests: this.activeTestCount,
      failedTests: this.failedTests,
      duration: Date.now() - this.testStartTime
    };
  }
}
