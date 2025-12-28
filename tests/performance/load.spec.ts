// PERFORMANCE VIOLATION: Poor performance testing practices
// COMPLEXITY VIOLATION: Overly complex performance test logic
// MEMORY VIOLATION: Memory-intensive performance tests

import { test, expect } from '@playwright/test';
import { PerformanceTestUtils } from '../../utils/PerformanceTestUtils';
import { TestAlgorithmUtils } from '../../utils/TestAlgorithmUtils';
import { TestDataProcessor } from '../../utils/TestDataProcessor';

test.describe('Load Performance Tests', () => {
  // PERFORMANCE VIOLATION: Global test data accumulation
  const loadTestResults: any[] = [];

  test.beforeAll(async () => {
    // PERFORMANCE VIOLATION: Heavy setup that affects all tests
    console.log('Starting load performance test suite...');
  });

  // PERFORMANCE VIOLATION: Synchronous performance test (blocks event loop)
  test('should handle 100 concurrent users', async ({ page, browser }) => {
    PerformanceTestUtils.startPerformanceMeasurement('concurrent-users-100');

    // PERFORMANCE VIOLATION: Creating many pages synchronously
    const pages = [];
    for (let i = 0; i < 100; i++) {
      const newPage = await browser.newPage();
      pages.push(newPage);
    }

    // PERFORMANCE VIOLATION: Sequential page operations (not truly concurrent)
    for (const page of pages) {
      await page.goto('/');
      await page.fill('[data-test="username"]', `user${Math.random()}`);
      await page.click('[data-test="login-button"]');
    }

    // PERFORMANCE VIOLATION: Synchronous waiting
    await page.waitForTimeout(5000);

    // PERFORMANCE VIOLATION: No proper cleanup
    // pages are not closed, causing memory leaks

    const result = PerformanceTestUtils.endPerformanceMeasurement('concurrent-users-100');
    loadTestResults.push(result);

    expect(result.duration).toBeLessThan(30000); // PERFORMANCE VIOLATION: Arbitrary threshold
  });

  // COMPLEXITY VIOLATION: Overly complex performance test with multiple concerns
  test('should process large dataset efficiently', async ({ page }) => {
    PerformanceTestUtils.startPerformanceMeasurement('large-dataset-processing');

    // PERFORMANCE VIOLATION: Creating large dataset in memory
    const largeDataset = [];
    for (let i = 0; i < 10000; i++) {
      largeDataset.push({
        id: i,
        name: `Test Item ${i}`,
        description: 'A'.repeat(1000), // 1KB per item
        metadata: {
          created: new Date(),
          tags: ['performance', 'test', 'large'],
          nested: {
            data: 'B'.repeat(500), // More memory usage
            array: Array.from({ length: 100 }, (_, j) => j)
          }
        }
      });
    }

    // MEMORY VIOLATION: Processing large dataset without streaming
    const processedData = TestDataProcessor.processTestResults(largeDataset, {
      status: 'completed',
      tags: ['performance']
    }, {
      field: 'name',
      order: 'asc'
    }, {
      field: 'status'
    }, {
      calculateAverages: true
    });

    // PERFORMANCE VIOLATION: Asserting on memory usage (not reliable)
    expect(processedData.results.length).toBeGreaterThan(5000);

    const result = PerformanceTestUtils.endPerformanceMeasurement('large-dataset-processing');
    loadTestResults.push(result);

    // PERFORMANCE VIOLATION: Arbitrary performance assertion
    expect(result.duration).toBeLessThan(10000);
  });

  // PERFORMANCE VIOLATION: Inefficient algorithm testing
  test('should find correlated failures efficiently', async ({ page }) => {
    PerformanceTestUtils.startPerformanceMeasurement('correlation-analysis');

    // PERFORMANCE VIOLATION: Creating test data with failures
    const testResults = [];
    for (let i = 0; i < 200; i++) {
      testResults.push({
        id: `test-${i}`,
        name: `Test ${i}`,
        status: Math.random() > 0.7 ? 'failed' : 'passed',
        duration: Math.random() * 1000,
        error: Math.random() > 0.7 ? {
          message: 'Database connection timeout',
          stack: 'Error: Database connection timeout\n    at query...'
        } : null,
        timestamp: Date.now() + Math.random() * 1000
      });
    }

    // PERFORMANCE VIOLATION: O(n³) algorithm on large dataset
    const correlations = TestAlgorithmUtils.findCorrelatedTestFailures(testResults);

    const result = PerformanceTestUtils.endPerformanceMeasurement('correlation-analysis');
    loadTestResults.push(result);

    // PERFORMANCE VIOLATION: Testing algorithm correctness in performance test
    expect(correlations.length).toBeGreaterThan(0);

    // PERFORMANCE VIOLATION: Performance assertion without baseline
    expect(result.duration).toBeLessThan(5000);
  });

  // MEMORY VIOLATION: Memory leak testing
  test('should not have memory leaks during sustained load', async ({ page }) => {
    PerformanceTestUtils.startPerformanceMeasurement('memory-leak-test');

    // MEMORY VIOLATION: Creating objects without cleanup
    const testObjects = [];
    for (let i = 0; i < 1000; i++) {
      testObjects.push({
        id: i,
        data: 'X'.repeat(10000), // 10KB per object
        references: Array.from({ length: 100 }, () => ({ circular: null })),
        timestamp: new Date()
      });

      // MEMORY VIOLATION: Creating circular references
      testObjects[i].references.forEach(ref => ref.circular = testObjects[i]);
    }

    // MEMORY VIOLATION: Keeping all objects in memory
    await page.waitForTimeout(1000);

    // MEMORY VIOLATION: No cleanup of test objects
    // testObjects array keeps all 1000 objects alive

    const result = PerformanceTestUtils.endPerformanceMeasurement('memory-leak-test');
    loadTestResults.push(result);

    // MEMORY VIOLATION: Testing memory usage (unreliable in test environment)
    expect(result.memoryDelta).toBeLessThan(50 * 1024 * 1024); // 50MB arbitrary limit
  });

  // COMPLEXITY VIOLATION: Complex performance baseline testing
  test('should maintain performance baseline', async ({ page }) => {
    PerformanceTestUtils.startPerformanceMeasurement('baseline-check');

    // COMPLEXITY VIOLATION: Complex baseline checking logic
    const baselineResults = [];

    // Run multiple iterations
    for (let iteration = 0; iteration < 5; iteration++) {
      const iterationStart = Date.now();

      // Complex operation to measure
      await page.goto('/');
      await page.fill('[data-test="username"]', 'performance-test');
      await page.fill('[data-test="password"]', 'password123');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory');

      // More complex operations
      const products = page.locator('.inventory_item');
      const count = await products.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        await products.nth(i).click();
        await page.goBack();
      }

      const iterationDuration = Date.now() - iterationStart;
      baselineResults.push(iterationDuration);

      // Reset for next iteration
      await page.goto('/');
    }

    // COMPLEXITY VIOLATION: Complex baseline analysis
    const averageDuration = baselineResults.reduce((sum, d) => sum + d, 0) / baselineResults.length;
    const standardDeviation = Math.sqrt(
      baselineResults.reduce((sum, d) => sum + Math.pow(d - averageDuration, 2), 0) / baselineResults.length
    );

    const result = PerformanceTestUtils.endPerformanceMeasurement('baseline-check');

    // COMPLEXITY VIOLATION: Multiple performance assertions
    expect(averageDuration).toBeLessThan(5000);
    expect(standardDeviation).toBeLessThan(1000);
    expect(result.memoryDelta).toBeLessThan(10 * 1024 * 1024);

    loadTestResults.push({
      ...result,
      baselineAverage: averageDuration,
      baselineStdDev: standardDeviation
    });
  });

  // PERFORMANCE VIOLATION: Database performance testing anti-patterns
  test('should handle database load efficiently', async ({ page }) => {
    PerformanceTestUtils.startPerformanceMeasurement('database-load-test');

    // PERFORMANCE VIOLATION: N+1 query pattern simulation
    const userIds = Array.from({ length: 100 }, (_, i) => i + 1);

    const userDetails = [];
    for (const userId of userIds) {
      // PERFORMANCE VIOLATION: Individual queries instead of batch
      const cachedResult = await TestDataProcessor.getCachedData(
        `user-${userId}`,
        async () => {
          // Simulate database query
          await page.waitForTimeout(10); // Simulate query time
          return {
            id: userId,
            name: `User ${userId}`,
            email: `user${userId}@example.com`,
            orders: Math.floor(Math.random() * 10)
          };
        }
      );
      userDetails.push(cachedResult);
    }

    // PERFORMANCE VIOLATION: Processing all data at once
    const processedUsers = TestDataProcessor.processTestResults(userDetails, {
      tags: ['active']
    }, {
      field: 'orders',
      order: 'desc'
    }, null, {
      calculateAverages: true
    });

    const result = PerformanceTestUtils.endPerformanceMeasurement('database-load-test');
    loadTestResults.push(result);

    expect(processedUsers.results.length).toBe(100);
    expect(result.duration).toBeLessThan(15000);
  });

  // PERFORMANCE VIOLATION: Network performance testing
  test('should handle network latency gracefully', async ({ page }) => {
    PerformanceTestUtils.startPerformanceMeasurement('network-latency-test');

    // PERFORMANCE VIOLATION: Simulating network conditions poorly
    await page.route('**/api/**', async route => {
      // PERFORMANCE VIOLATION: Fixed delay (not realistic)
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    // PERFORMANCE VIOLATION: Testing with artificial delays
    const startTime = Date.now();
    await page.goto('/');
    await page.fill('[data-test="username"]', 'network-test');
    await page.fill('[data-test="password"]', 'password123');
    await page.click('[data-test="login-button"]');

    // PERFORMANCE VIOLATION: Waiting for fixed time instead of condition
    await page.waitForTimeout(3000);

    const loadTime = Date.now() - startTime;

    const result = PerformanceTestUtils.endPerformanceMeasurement('network-latency-test');
    loadTestResults.push(result);

    // PERFORMANCE VIOLATION: Testing load time with artificial network conditions
    expect(loadTime).toBeGreaterThan(2000); // Should be slow due to artificial delay
    expect(loadTime).toBeLessThan(10000);
  });

  // COMPLEXITY VIOLATION: Complex performance reporting
  test.afterAll(async () => {
    // COMPLEXITY VIOLATION: Complex test result analysis
    if (loadTestResults.length > 0) {
      const report = PerformanceTestUtils.generatePerformanceReport();

      // COMPLEXITY VIOLATION: Complex reporting logic in test
      const totalDuration = loadTestResults.reduce((sum, r) => sum + (r.duration || 0), 0);
      const averageDuration = totalDuration / loadTestResults.length;

      const totalMemoryDelta = loadTestResults.reduce((sum, r) => sum + (r.memoryDelta || 0), 0);
      const averageMemoryDelta = totalMemoryDelta / loadTestResults.length;

      const gradeDistribution = loadTestResults.reduce((dist, r) => {
        const grade = r.performanceGrade || 'Unknown';
        dist[grade] = (dist[grade] || 0) + 1;
        return dist;
      }, {});

      console.log('Load Performance Test Results:');
      console.log(`Total Tests: ${loadTestResults.length}`);
      console.log(`Average Duration: ${averageDuration.toFixed(2)}ms`);
      console.log(`Average Memory Delta: ${(averageMemoryDelta / 1024 / 1024).toFixed(2)}MB`);
      console.log('Grade Distribution:', gradeDistribution);

      // PERFORMANCE VIOLATION: Writing large report to disk in test
      const fs = require('fs');
      fs.writeFileSync('load-performance-report.json', JSON.stringify({
        summary: {
          totalTests: loadTestResults.length,
          averageDuration,
          averageMemoryDelta,
          gradeDistribution
        },
        detailedResults: loadTestResults,
        generatedAt: new Date()
      }, null, 2));
    }

    // PERFORMANCE VIOLATION: No cleanup of accumulated test data
    // loadTestResults and other global state remains
  });
});
