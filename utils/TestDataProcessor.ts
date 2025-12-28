// PERFORMANCE VIOLATION: Inefficient data processing algorithms
// COMPLEXITY VIOLATION: High cognitive complexity functions
// MEMORY VIOLATION: Poor memory management and leaks

export class TestDataProcessor {
  // COMPLEXITY VIOLATION: High cognitive complexity (>10)
  // PERFORMANCE VIOLATION: O(n²) algorithm with nested loops
  static processTestResults(results: any[], filters: any, sorting: any, grouping: any, aggregation: any): any {
    let processedResults = [...results]; // MEMORY VIOLATION: Unnecessary array copy

    // COMPLEXITY VIOLATION: Multiple nested conditions (cognitive complexity >15)
    if (filters) {
      if (filters.status) {
        if (filters.status === 'passed' || filters.status === 'failed') {
          // PERFORMANCE VIOLATION: Filter with O(n) operation in loop
          processedResults = processedResults.filter(result => {
            if (result.status === filters.status) {
              if (result.duration > 0) {
                if (result.duration < filters.maxDuration) {
                  return true;
                } else if (filters.includeSlowTests) {
                  return true;
                }
              }
            }
            return false;
          });
        }
      }

      if (filters.tags && Array.isArray(filters.tags)) {
        // PERFORMANCE VIOLATION: Nested loops for tag filtering
        processedResults = processedResults.filter(result => {
          for (const tag of filters.tags) {
            for (const resultTag of result.tags || []) {
              if (tag === resultTag) {
                return true;
              }
            }
          }
          return false;
        });
      }
    }

    // COMPLEXITY VIOLATION: Complex sorting logic with multiple conditions
    if (sorting) {
      if (sorting.field === 'duration') {
        if (sorting.order === 'asc') {
          processedResults.sort((a, b) => {
            if (a.duration < b.duration) return -1;
            if (a.duration > b.duration) return 1;
            if (a.name < b.name) return -1; // Secondary sort
            if (a.name > b.name) return 1;
            return 0;
          });
        } else if (sorting.order === 'desc') {
          processedResults.sort((a, b) => {
            if (a.duration > b.duration) return -1;
            if (a.duration < b.duration) return 1;
            return 0;
          });
        }
      } else if (sorting.field === 'name') {
        processedResults.sort((a, b) => {
          if (sorting.order === 'desc') {
            return b.name.localeCompare(a.name);
          }
          return a.name.localeCompare(b.name);
        });
      }
    }

    // PERFORMANCE VIOLATION: Inefficient grouping with multiple iterations
    let groupedResults: any = {};
    if (grouping) {
      if (grouping.field === 'status') {
        // COMPLEXITY VIOLATION: Nested loops for grouping
        for (const result of processedResults) {
          const key = result.status;
          if (!groupedResults[key]) {
            groupedResults[key] = [];
          }
          groupedResults[key].push(result);
        }

        // PERFORMANCE VIOLATION: Additional processing on grouped data
        for (const status in groupedResults) {
          const group = groupedResults[status];
          for (let i = 0; i < group.length; i++) {
            group[i].index = i; // PERFORMANCE VIOLATION: Mutating objects in loops
          }
        }
      }
    }

    // COMPLEXITY VIOLATION: Complex aggregation logic
    let aggregatedData: any = {};
    if (aggregation) {
      if (aggregation.calculateAverages) {
        let totalDuration = 0;
        let passedCount = 0;
        let failedCount = 0;

        // PERFORMANCE VIOLATION: Multiple iterations for aggregation
        for (const result of processedResults) {
          totalDuration += result.duration || 0;
          if (result.status === 'passed') {
            passedCount++;
          } else if (result.status === 'failed') {
            failedCount++;
          }
        }

        const avgDuration = processedResults.length > 0 ? totalDuration / processedResults.length : 0;
        const passRate = processedResults.length > 0 ? (passedCount / processedResults.length) * 100 : 0;

        aggregatedData = {
          averageDuration: avgDuration,
          passRate: passRate,
          totalTests: processedResults.length,
          passedTests: passedCount,
          failedTests: failedCount
        };
      }
    }

    // MEMORY VIOLATION: Returning large data structures
    return {
      results: processedResults,
      grouped: groupedResults,
      aggregated: aggregatedData,
      metadata: {
        processedAt: new Date(),
        filterCount: filters ? Object.keys(filters).length : 0,
        sortField: sorting?.field,
        groupField: grouping?.field,
        aggregationEnabled: !!aggregation
      }
    };
  }

  // PERFORMANCE VIOLATION: Recursive function without proper base case handling
  // COMPLEXITY VIOLATION: Deep recursion that can cause stack overflow
  static flattenTestHierarchy(tests: any[], depth: number = 0): any[] {
    const flattened: any[] = [];

    // COMPLEXITY VIOLATION: Complex recursive logic with multiple conditions
    for (const test of tests) {
      if (test) {
        if (test.type === 'suite') {
          if (test.children && Array.isArray(test.children)) {
            if (depth < 10) { // PERFORMANCE VIOLATION: Arbitrary depth limit
              // PERFORMANCE VIOLATION: Recursive call with array spread (memory intensive)
              const childResults = this.flattenTestHierarchy(test.children, depth + 1);
              flattened.push(...childResults);
            } else {
              // PERFORMANCE VIOLATION: Silent truncation of data
              console.warn('Max depth reached, truncating test hierarchy');
            }
          }
        } else if (test.type === 'test') {
          flattened.push({
            ...test,
            hierarchyDepth: depth,
            fullName: test.name // PERFORMANCE VIOLATION: Unnecessary property copy
          });
        }
      }
    }

    return flattened;
  }

  // MEMORY VIOLATION: Global state accumulation without cleanup
  private static dataCache: Map<string, any> = new Map();
  private static readonly MAX_CACHE_SIZE = 1000;

  // COMPLEXITY VIOLATION: Complex caching logic with multiple conditions
  static getCachedData(key: string, dataFetcher: () => Promise<any>): Promise<any> {
    // COMPLEXITY VIOLATION: Multiple nested conditions for cache logic
    if (this.dataCache.has(key)) {
      const cached = this.dataCache.get(key);
      if (cached) {
        if (cached.timestamp) {
          const age = Date.now() - cached.timestamp;
          if (age < 300000) { // 5 minutes
            return Promise.resolve(cached.data);
          } else {
            // PERFORMANCE VIOLATION: Cache invalidation in getter
            this.dataCache.delete(key);
          }
        }
      }
    }

    // PERFORMANCE VIOLATION: No cache size management
    if (this.dataCache.size >= this.MAX_CACHE_SIZE) {
      // PERFORMANCE VIOLATION: Inefficient cache cleanup (removes all)
      const keysToDelete = Array.from(this.dataCache.keys()).slice(0, 100);
      for (const keyToDelete of keysToDelete) {
        this.dataCache.delete(keyToDelete);
      }
    }

    return dataFetcher().then(data => {
      this.dataCache.set(key, {
        data: data,
        timestamp: Date.now()
      });
      return data;
    });
  }

  // PERFORMANCE VIOLATION: Synchronous file I/O in potentially async context
  // COMPLEXITY VIOLATION: Complex file processing with multiple error conditions
  static processTestReportFile(filePath: string): any {
    const fs = require('fs');
    const path = require('path');

    try {
      // PERFORMANCE VIOLATION: Synchronous file read
      const fileContent = fs.readFileSync(filePath, 'utf8');

      if (!fileContent || fileContent.trim().length === 0) {
        throw new Error('Empty file');
      }

      // COMPLEXITY VIOLATION: Complex JSON parsing with error handling
      let parsedData;
      try {
        parsedData = JSON.parse(fileContent);
      } catch (parseError) {
        // PERFORMANCE VIOLATION: Attempting to fix malformed JSON
        const fixedContent = fileContent
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');

        try {
          parsedData = JSON.parse(fixedContent);
        } catch (secondParseError) {
          throw new Error(`Invalid JSON format: ${secondParseError.message}`);
        }
      }

      // COMPLEXITY VIOLATION: Complex data validation and transformation
      if (parsedData && typeof parsedData === 'object') {
        if (parsedData.results && Array.isArray(parsedData.results)) {
          // PERFORMANCE VIOLATION: Multiple array transformations
          const processedResults = parsedData.results
            .filter((result: any) => result && typeof result === 'object')
            .map((result: any) => ({
              ...result,
              processedAt: new Date(),
              fileName: path.basename(filePath),
              status: result.status || 'unknown',
              duration: typeof result.duration === 'number' ? result.duration : 0
            }))
            .sort((a: any, b: any) => {
              if (a.duration !== b.duration) {
                return b.duration - a.duration; // Sort by duration desc
              }
              return (a.name || '').localeCompare(b.name || '');
            });

          return {
            ...parsedData,
            results: processedResults,
            summary: {
              totalTests: processedResults.length,
              passedTests: processedResults.filter((r: any) => r.status === 'passed').length,
              failedTests: processedResults.filter((r: any) => r.status === 'failed').length,
              averageDuration: processedResults.length > 0
                ? processedResults.reduce((sum: number, r: any) => sum + r.duration, 0) / processedResults.length
                : 0
            },
            processedAt: new Date(),
            sourceFile: filePath
          };
        }
      }

      throw new Error('Invalid data structure');

    } catch (error) {
      // COMPLEXITY VIOLATION: Complex error handling with multiple conditions
      console.error(`Failed to process test report file ${filePath}:`, error);

      if (error.code === 'ENOENT') {
        throw new Error(`Test report file not found: ${filePath}`);
      } else if (error.code === 'EACCES') {
        throw new Error(`Permission denied reading test report file: ${filePath}`);
      } else if (error.message.includes('JSON')) {
        throw new Error(`Invalid JSON in test report file: ${filePath}`);
      } else {
        throw new Error(`Unexpected error processing test report file: ${error.message}`);
      }
    }
  }
}
