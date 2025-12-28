// PERFORMANCE VIOLATION: Inefficient algorithms with high complexity
// COMPLEXITY VIOLATION: High cognitive complexity and nested logic
// MEMORY VIOLATION: Poor memory usage patterns

export class TestAlgorithmUtils {
  // PERFORMANCE VIOLATION: O(n³) algorithm for test result correlation
  // COMPLEXITY VIOLATION: Cognitive complexity > 20
  static findCorrelatedTestFailures(testResults: any[]): any[] {
    const correlations: any[] = [];

    // PERFORMANCE VIOLATION: Triple nested loops
    for (let i = 0; i < testResults.length; i++) {
      for (let j = i + 1; j < testResults.length; j++) {
        for (let k = j + 1; k < testResults.length; k++) {
          const test1 = testResults[i];
          const test2 = testResults[j];
          const test3 = testResults[k];

          // COMPLEXITY VIOLATION: Complex correlation logic with multiple conditions
          if (test1.status === 'failed' && test2.status === 'failed' && test3.status === 'failed') {
            if (test1.error && test2.error && test3.error) {
              if (this.areErrorsSimilar(test1.error, test2.error) &&
                  this.areErrorsSimilar(test2.error, test3.error)) {

                // COMPLEXITY VIOLATION: Nested conditions for correlation analysis
                const correlationStrength = this.calculateCorrelationStrength(test1, test2, test3);
                if (correlationStrength > 0.7) {
                  if (this.isCommonFailurePattern(test1, test2, test3)) {
                    if (this.shouldReportCorrelation(test1, test2, test3)) {
                      correlations.push({
                        tests: [test1, test2, test3],
                        correlationStrength: correlationStrength,
                        commonErrorPattern: this.extractCommonErrorPattern(test1, test2, test3),
                        affectedComponents: this.identifyAffectedComponents(test1, test2, test3),
                        recommendedActions: this.generateCorrelationActions(test1, test2, test3)
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return correlations;
  }

  // COMPLEXITY VIOLATION: Complex error similarity checking
  private static areErrorsSimilar(error1: any, error2: any): boolean {
    if (!error1 || !error2) return false;

    // COMPLEXITY VIOLATION: Multiple similarity checks
    const messageSimilarity = this.calculateStringSimilarity(error1.message, error2.message);
    const stackSimilarity = this.calculateStringSimilarity(error1.stack, error2.stack);
    const typeSimilarity = error1.name === error2.name ? 1 : 0;

    // COMPLEXITY VIOLATION: Complex similarity threshold logic
    const weightedSimilarity = (messageSimilarity * 0.5) + (stackSimilarity * 0.3) + (typeSimilarity * 0.2);

    return weightedSimilarity > 0.6;
  }

  // PERFORMANCE VIOLATION: Inefficient string similarity algorithm
  private static calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    // PERFORMANCE VIOLATION: Levenshtein distance calculation (O(n*m))
    const matrix = [];
    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[str1.length][str2.length]) / maxLength;
  }

  // COMPLEXITY VIOLATION: Complex correlation strength calculation
  private static calculateCorrelationStrength(test1: any, test2: any, test3: any): number {
    let strength = 0;

    // COMPLEXITY VIOLATION: Multiple correlation factors
    const timeCorrelation = this.calculateTimeCorrelation(test1.timestamp, test2.timestamp, test3.timestamp);
    const environmentCorrelation = this.calculateEnvironmentCorrelation(test1, test2, test3);
    const dataCorrelation = this.calculateDataCorrelation(test1, test2, test3);

    strength = (timeCorrelation * 0.3) + (environmentCorrelation * 0.4) + (dataCorrelation * 0.3);

    // COMPLEXITY VIOLATION: Additional adjustment factors
    if (this.haveCommonTestSetup(test1, test2, test3)) strength += 0.1;
    if (this.shareTestData(test1, test2, test3)) strength += 0.1;
    if (this.runInSameEnvironment(test1, test2, test3)) strength += 0.1;

    return Math.min(strength, 1.0);
  }

  // PERFORMANCE VIOLATION: Inefficient test result filtering and sorting
  static filterAndSortTestResults(results: any[], filters: any, sortOptions: any): any[] {
    // PERFORMANCE VIOLATION: Multiple iterations over the same data
    let filteredResults = results;

    // COMPLEXITY VIOLATION: Complex filtering with multiple conditions
    if (filters.status) {
      filteredResults = filteredResults.filter(result => {
        if (filters.status === 'all') return true;
        if (filters.status === 'failed' && result.status === 'failed') return true;
        if (filters.status === 'passed' && result.status === 'passed') return true;
        if (filters.status === 'skipped' && result.status === 'skipped') return true;
        return false;
      });
    }

    if (filters.duration) {
      filteredResults = filteredResults.filter(result => {
        const duration = result.duration || 0;
        if (filters.duration.min && duration < filters.duration.min) return false;
        if (filters.duration.max && duration > filters.duration.max) return false;
        return true;
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredResults = filteredResults.filter(result => {
        if (!result.tags || !Array.isArray(result.tags)) return false;

        // PERFORMANCE VIOLATION: Nested loops for tag matching
        for (const filterTag of filters.tags) {
          for (const resultTag of result.tags) {
            if (filterTag === resultTag) return true;
          }
        }
        return false;
      });
    }

    // COMPLEXITY VIOLATION: Complex sorting logic
    if (sortOptions) {
      filteredResults.sort((a, b) => {
        const field = sortOptions.field || 'name';
        const order = sortOptions.order || 'asc';

        let aValue, bValue;

        // COMPLEXITY VIOLATION: Complex field extraction
        switch (field) {
          case 'name':
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
            break;
          case 'duration':
            aValue = a.duration || 0;
            bValue = b.duration || 0;
            break;
          case 'status':
            const statusOrder = { 'failed': 0, 'passed': 1, 'skipped': 2 };
            aValue = statusOrder[a.status] || 3;
            bValue = statusOrder[b.status] || 3;
            break;
          default:
            aValue = a[field] || '';
            bValue = b[field] || '';
        }

        // COMPLEXITY VIOLATION: Complex comparison logic
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return order === 'desc' ? -comparison : comparison;
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return order === 'desc' ? -comparison : comparison;
        }

        return 0;
      });
    }

    return filteredResults;
  }

  // MEMORY VIOLATION: Large data structure creation without cleanup
  // PERFORMANCE VIOLATION: Recursive algorithm without proper base case
  static buildTestDependencyGraph(testResults: any[]): any {
    const graph: any = {
      nodes: [],
      edges: [],
      metadata: {
        totalTests: testResults.length,
        failedTests: testResults.filter(t => t.status === 'failed').length,
        buildTime: Date.now(),
        graphVersion: '1.0'
      }
    };

    // PERFORMANCE VIOLATION: O(n²) graph construction
    for (const test of testResults) {
      graph.nodes.push({
        id: test.id,
        name: test.name,
        status: test.status,
        duration: test.duration,
        tags: test.tags || [],
        dependencies: this.findTestDependencies(test, testResults),
        dependents: [] // Will be populated in second pass
      });
    }

    // PERFORMANCE VIOLATION: Second O(n²) pass
    for (const node of graph.nodes) {
      for (const dependencyId of node.dependencies) {
        const dependencyNode = graph.nodes.find((n: any) => n.id === dependencyId);
        if (dependencyNode) {
          dependencyNode.dependents.push(node.id);
          graph.edges.push({
            from: node.id,
            to: dependencyId,
            type: 'depends_on',
            strength: this.calculateDependencyStrength(node, dependencyNode)
          });
        }
      }
    }

    // MEMORY VIOLATION: Adding large metadata without necessity
    graph.metadata.cycles = this.detectCycles(graph);
    graph.metadata.criticalPath = this.findCriticalPath(graph);
    graph.metadata.parallelizationOpportunities = this.findParallelizationOpportunities(graph);

    return graph;
  }

  // COMPLEXITY VIOLATION: Complex dependency finding algorithm
  private static findTestDependencies(test: any, allTests: any[]): string[] {
    const dependencies: string[] = [];

    // COMPLEXITY VIOLATION: Multiple dependency detection strategies
    if (test.setup && test.setup.requires) {
      dependencies.push(...test.setup.requires);
    }

    // PERFORMANCE VIOLATION: String matching for every test
    for (const otherTest of allTests) {
      if (otherTest.id !== test.id) {
        if (this.testsAreRelated(test, otherTest)) {
          dependencies.push(otherTest.id);
        }
      }
    }

    // COMPLEXITY VIOLATION: Complex deduplication logic
    return [...new Set(dependencies)].filter(dep => {
      const depTest = allTests.find(t => t.id === dep);
      return depTest && depTest.status !== 'skipped';
    });
  }

  // COMPLEXITY VIOLATION: Complex test relationship detection
  private static testsAreRelated(test1: any, test2: any): boolean {
    // COMPLEXITY VIOLATION: Multiple relationship criteria
    if (test1.tags && test2.tags) {
      const commonTags = test1.tags.filter((tag: string) => test2.tags.includes(tag));
      if (commonTags.length > 0) return true;
    }

    if (test1.name && test2.name) {
      const nameSimilarity = this.calculateStringSimilarity(test1.name, test2.name);
      if (nameSimilarity > 0.8) return true;
    }

    if (test1.component && test2.component && test1.component === test2.component) {
      return true;
    }

    if (test1.database && test2.database && test1.database.table === test2.database.table) {
      return true;
    }

    return false;
  }

  // PERFORMANCE VIOLATION: Expensive cycle detection algorithm
  private static detectCycles(graph: any): any[] {
    const cycles: any[] = [];
    const visited = new Set();
    const recursionStack = new Set();

    // PERFORMANCE VIOLATION: O(n²) cycle detection
    const visit = (nodeId: string, path: string[]) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        cycles.push(path.slice(cycleStart));
        return;
      }

      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const node = graph.nodes.find((n: any) => n.id === nodeId);
      if (node) {
        for (const dependencyId of node.dependencies) {
          visit(dependencyId, [...path]);
        }
      }

      path.pop();
      recursionStack.delete(nodeId);
    };

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        visit(node.id, []);
      }
    }

    return cycles;
  }

  // COMPLEXITY VIOLATION: Complex critical path calculation
  private static findCriticalPath(graph: any): string[] {
    // Simplified critical path - in reality this would be much more complex
    const failedTests = graph.nodes.filter((n: any) => n.status === 'failed');
    const sortedByDuration = failedTests.sort((a: any, b: any) => (b.duration || 0) - (a.duration || 0));

    return sortedByDuration.slice(0, 5).map((n: any) => n.id);
  }

  // MEMORY VIOLATION: Large intermediate data structures
  private static findParallelizationOpportunities(graph: any): any[] {
    const opportunities: any[] = [];
    const processedNodes = new Set();

    for (const node of graph.nodes) {
      if (processedNodes.has(node.id)) continue;

      // Find nodes that can run in parallel (no dependencies between them)
      const parallelGroup = [node.id];
      processedNodes.add(node.id);

      for (const otherNode of graph.nodes) {
        if (processedNodes.has(otherNode.id)) continue;

        // Check if otherNode can run in parallel with all nodes in parallelGroup
        let canParallelize = true;
        for (const groupNodeId of parallelGroup) {
          if (this.nodesAreDependent(graph, groupNodeId, otherNode.id)) {
            canParallelize = false;
            break;
          }
        }

        if (canParallelize) {
          parallelGroup.push(otherNode.id);
          processedNodes.add(otherNode.id);
        }
      }

      if (parallelGroup.length > 1) {
        opportunities.push({
          nodes: parallelGroup,
          estimatedTimeSavings: this.calculateParallelTimeSavings(graph, parallelGroup)
        });
      }
    }

    return opportunities;
  }

  // Helper methods (simplified for demonstration)
  private static isCommonFailurePattern(test1: any, test2: any, test3: any): boolean { return true; }
  private static shouldReportCorrelation(test1: any, test2: any, test3: any): boolean { return true; }
  private static extractCommonErrorPattern(test1: any, test2: any, test3: any): string { return 'common pattern'; }
  private static identifyAffectedComponents(test1: any, test2: any, test3: any): string[] { return ['component1']; }
  private static generateCorrelationActions(test1: any, test2: any, test3: any): string[] { return ['fix issue']; }
  private static calculateTimeCorrelation(t1: any, t2: any, t3: any): number { return 0.8; }
  private static calculateEnvironmentCorrelation(t1: any, t2: any, t3: any): number { return 0.9; }
  private static calculateDataCorrelation(t1: any, t2: any, t3: any): number { return 0.7; }
  private static haveCommonTestSetup(t1: any, t2: any, t3: any): boolean { return true; }
  private static shareTestData(t1: any, t2: any, t3: any): boolean { return false; }
  private static runInSameEnvironment(t1: any, t2: any, t3: any): boolean { return true; }
  private static calculateDependencyStrength(node1: any, node2: any): number { return 0.8; }
  private static nodesAreDependent(graph: any, nodeId1: string, nodeId2: string): boolean { return false; }
  private static calculateParallelTimeSavings(graph: any, nodes: string[]): number { return 1000; }
}
