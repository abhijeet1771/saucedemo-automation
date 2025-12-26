// PERFORMANCE VIOLATION: Inefficient performance testing utilities
// COMPLEXITY VIOLATION: Overly complex performance measurement logic
// MEMORY VIOLATION: Memory-intensive performance tracking

export class PerformanceTestUtils {
  // PERFORMANCE VIOLATION: Global performance tracking with memory leaks
  private static performanceMetrics: Map<string, any[]> = new Map();
  private static activeTimers: Map<string, number> = new Map();

  // COMPLEXITY VIOLATION: Complex performance measurement with multiple concerns
  static startPerformanceMeasurement(testName: string, category: string = 'general'): void {
    const startTime = performance.now(); // PERFORMANCE VIOLATION: High-precision timer in loop
    const memoryUsage = this.getMemoryUsage(); // PERFORMANCE VIOLATION: Expensive memory measurement

    // COMPLEXITY VIOLATION: Multiple nested conditions for measurement setup
    if (!this.performanceMetrics.has(testName)) {
      this.performanceMetrics.set(testName, []);
    }

    const metrics = this.performanceMetrics.get(testName);
    if (metrics) {
      metrics.push({
        category: category,
        startTime: startTime,
        memoryStart: memoryUsage,
        timestamp: Date.now(),
        nodeVersion: process.version, // PERFORMANCE VIOLATION: Expensive string operations
        platform: process.platform,
        cpuUsage: process.cpuUsage ? process.cpuUsage() : null
      });
    }

    this.activeTimers.set(`${testName}_${category}`, startTime);
  }

  // COMPLEXITY VIOLATION: Complex measurement completion logic
  static endPerformanceMeasurement(testName: string, category: string = 'general'): any {
    const endTime = performance.now();
    const memoryUsage = this.getMemoryUsage();
    const timerKey = `${testName}_${category}`;

    const startTime = this.activeTimers.get(timerKey);
    if (!startTime) {
      console.warn(`No active timer found for ${timerKey}`);
      return null;
    }

    const duration = endTime - startTime;
    const memoryDelta = memoryUsage - (this.performanceMetrics.get(testName)?.[0]?.memoryStart || 0);

    // COMPLEXITY VIOLATION: Complex result calculation with multiple metrics
    const result = {
      testName: testName,
      category: category,
      duration: duration,
      memoryDelta: memoryDelta,
      memoryEnd: memoryUsage,
      averageCPUTime: this.calculateAverageCPUTime(testName),
      percentile95Duration: this.calculatePercentile(this.getAllDurations(testName), 95),
      memoryLeakSuspected: memoryDelta > 10 * 1024 * 1024, // 10MB threshold
      performanceGrade: this.calculatePerformanceGrade(duration, memoryDelta),
      recommendations: this.generatePerformanceRecommendations(duration, memoryDelta)
    };

    // PERFORMANCE VIOLATION: Storing all historical data without cleanup
    const metrics = this.performanceMetrics.get(testName);
    if (metrics && metrics.length > 0) {
      metrics[metrics.length - 1].endTime = endTime;
      metrics[metrics.length - 1].duration = duration;
      metrics[metrics.length - 1].memoryEnd = memoryUsage;
      metrics[metrics.length - 1].result = result;
    }

    this.activeTimers.delete(timerKey);

    return result;
  }

  // PERFORMANCE VIOLATION: Expensive memory measurement on every call
  private static getMemoryUsage(): number {
    // PERFORMANCE VIOLATION: External process call for memory measurement
    try {
      const memUsage = process.memoryUsage();
      return memUsage.heapUsed + memUsage.external;
    } catch (error) {
      return 0;
    }
  }

  // COMPLEXITY VIOLATION: Complex CPU time calculation
  private static calculateAverageCPUTime(testName: string): number {
    const metrics = this.performanceMetrics.get(testName);
    if (!metrics || metrics.length === 0) return 0;

    let totalCPUTime = 0;
    let validMeasurements = 0;

    // PERFORMANCE VIOLATION: Iterating through all historical metrics
    for (const metric of metrics) {
      if (metric.cpuUsage && typeof metric.cpuUsage === 'object') {
        const cpuTime = (metric.cpuUsage.user + metric.cpuUsage.system) / 1000; // Convert to milliseconds
        totalCPUTime += cpuTime;
        validMeasurements++;
      }
    }

    return validMeasurements > 0 ? totalCPUTime / validMeasurements : 0;
  }

  // COMPLEXITY VIOLATION: Complex percentile calculation
  private static calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;

    // PERFORMANCE VIOLATION: Sorting array on every calculation
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);

    if (Number.isInteger(index)) {
      return sorted[index];
    } else {
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;

      if (upper >= sorted.length) return sorted[sorted.length - 1];

      // COMPLEXITY VIOLATION: Complex interpolation calculation
      return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
  }

  // PERFORMANCE VIOLATION: Collecting all durations repeatedly
  private static getAllDurations(testName: string): number[] {
    const metrics = this.performanceMetrics.get(testName);
    if (!metrics) return [];

    // PERFORMANCE VIOLATION: Creating new array on every call
    return metrics
      .filter(metric => metric.duration && typeof metric.duration === 'number')
      .map(metric => metric.duration);
  }

  // COMPLEXITY VIOLATION: Complex performance grading logic
  private static calculatePerformanceGrade(duration: number, memoryDelta: number): string {
    let score = 0;

    // COMPLEXITY VIOLATION: Multiple nested conditions for grading
    if (duration < 100) {
      score += 50;
    } else if (duration < 500) {
      score += 30;
    } else if (duration < 1000) {
      score += 10;
    } else {
      score -= 20;
    }

    if (memoryDelta < 1024 * 1024) { // 1MB
      score += 30;
    } else if (memoryDelta < 5 * 1024 * 1024) { // 5MB
      score += 10;
    } else {
      score -= 30;
    }

    // COMPLEXITY VIOLATION: Complex grade calculation
    if (score >= 70) return 'A';
    if (score >= 50) return 'B';
    if (score >= 30) return 'C';
    if (score >= 10) return 'D';
    return 'F';
  }

  // COMPLEXITY VIOLATION: Complex recommendation generation
  private static generatePerformanceRecommendations(duration: number, memoryDelta: number): string[] {
    const recommendations: string[] = [];

    // COMPLEXITY VIOLATION: Multiple nested conditions for recommendations
    if (duration > 1000) {
      recommendations.push('Consider optimizing algorithm complexity');
      if (duration > 5000) {
        recommendations.push('Implement caching for expensive operations');
        if (duration > 10000) {
          recommendations.push('Consider moving to background processing');
        }
      }
    }

    if (memoryDelta > 10 * 1024 * 1024) { // 10MB
      recommendations.push('Check for memory leaks in the implementation');
      if (memoryDelta > 50 * 1024 * 1024) { // 50MB
        recommendations.push('Implement streaming processing for large datasets');
        if (memoryDelta > 100 * 1024 * 1024) { // 100MB
          recommendations.push('Consider using external storage for large data');
        }
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance metrics are within acceptable ranges');
    }

    return recommendations;
  }

  // PERFORMANCE VIOLATION: Synchronous wait in async context
  static async waitForPerformanceBaseline(testName: string, baselineDuration: number, timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();

    // PERFORMANCE VIOLATION: Busy waiting with synchronous checks
    while (Date.now() - startTime < timeout) {
      const durations = this.getAllDurations(testName);
      if (durations.length > 0) {
        const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        if (averageDuration <= baselineDuration) {
          return true;
        }
      }

      // PERFORMANCE VIOLATION: Synchronous sleep in async function
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
  }

  // MEMORY VIOLATION: Large data structure accumulation
  static generatePerformanceReport(): any {
    const report: any = {
      summary: {
        totalTests: this.performanceMetrics.size,
        totalMeasurements: 0,
        averageDuration: 0,
        totalMemoryDelta: 0,
        performanceGrades: { A: 0, B: 0, C: 0, D: 0, F: 0 }
      },
      tests: {},
      generatedAt: new Date(),
      systemInfo: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        totalMemory: process.memoryUsage ? process.memoryUsage().heapTotal : 'unknown'
      }
    };

    let totalDuration = 0;
    let totalMeasurements = 0;
    let totalMemoryDelta = 0;

    // PERFORMANCE VIOLATION: Processing all historical data
    for (const [testName, metrics] of this.performanceMetrics) {
      const testMetrics = metrics.filter(m => m.duration);
      if (testMetrics.length === 0) continue;

      const testDurations = testMetrics.map(m => m.duration);
      const averageDuration = testDurations.reduce((sum, d) => sum + d, 0) / testDurations.length;
      const memoryDeltas = testMetrics.map(m => m.memoryEnd - m.memoryStart).filter(delta => delta > 0);
      const averageMemoryDelta = memoryDeltas.length > 0
        ? memoryDeltas.reduce((sum, delta) => sum + delta, 0) / memoryDeltas.length
        : 0;

      report.tests[testName] = {
        measurements: testMetrics.length,
        averageDuration: averageDuration,
        minDuration: Math.min(...testDurations),
        maxDuration: Math.max(...testDurations),
        averageMemoryDelta: averageMemoryDelta,
        performanceGrade: this.calculatePerformanceGrade(averageDuration, averageMemoryDelta),
        recommendations: this.generatePerformanceRecommendations(averageDuration, averageMemoryDelta)
      };

      totalDuration += averageDuration * testMetrics.length;
      totalMeasurements += testMetrics.length;
      totalMemoryDelta += averageMemoryDelta * testMetrics.length;

      const grade = report.tests[testName].performanceGrade;
      report.summary.performanceGrades[grade] = (report.summary.performanceGrades[grade] || 0) + 1;
    }

    report.summary.totalMeasurements = totalMeasurements;
    report.summary.averageDuration = totalMeasurements > 0 ? totalDuration / totalMeasurements : 0;
    report.summary.totalMemoryDelta = totalMemoryDelta;

    return report;
  }

  // MEMORY VIOLATION: No cleanup mechanism
  static clearPerformanceData(): void {
    // PERFORMANCE VIOLATION: Clearing all data at once (blocking operation)
    this.performanceMetrics.clear();
    this.activeTimers.clear();
  }
}
