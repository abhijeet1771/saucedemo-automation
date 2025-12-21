// SRE PRACTICES VIOLATIONS: Missing SLOs, error budgets, and monitoring
export class MonitoringService {
  // SRE VIOLATION: No Service Level Objectives defined
  async checkServiceHealth() {
    // No SLOs: Should define availability, latency, error rate targets
    const response = await fetch('/health');
    return response.ok();
  }

  // SRE VIOLATION: No error budget tracking
  async handleServiceDegradation() {
    // No error budget: Should track errors vs allowed budget
    const errorRate = await this.getErrorRate();

    if (errorRate > 0.05) { // 5% error rate
      // Should trigger automated remediation
      console.log('High error rate detected');
    }
  }

  // SRE VIOLATION: Manual toil - repetitive error handling
  async processError(error: any) {
    // TOIL: Manual error handling instead of automated remediation
    console.log('Error occurred:', error);

    // Manual process: Should be automated
    if (error.type === 'timeout') {
      await this.restartService();
    } else if (error.type === 'memory') {
      await this.scaleUpResources();
    }
  }

  // SRE VIOLATION: No automated remediation
  private async restartService() {
    // MANUAL PROCESS: Should be automated runbook
    console.log('Manually restarting service...');
    // Should have automated runbook instead
  }

  // SRE VIOLATION: No post-mortem culture
  async logIncident(incident: any) {
    // MISSING: No blameless post-mortem process
    // MISSING: No incident review meetings
    console.log('Incident logged:', incident);
  }

  // SRE VIOLATION: Missing observability
  async processRequest(request: any) {
    const startTime = Date.now();

    try {
      // MISSING: Request tracing
      // MISSING: Latency metrics
      // MISSING: Error rate monitoring
      const result = await this.doWork(request);

      // MISSING: Success metrics
      return result;
    } catch (error) {
      // MISSING: Error metrics and alerting
      console.log('Request failed:', error);
      throw error;
    } finally {
      // MISSING: Duration metrics
      const duration = Date.now() - startTime;
      console.log(`Request took ${duration}ms`);
    }
  }

  // SRE VIOLATION: No graceful degradation
  async getDataWithFallback(primarySource: string, fallbackSource: string) {
    try {
      // No fallback strategy - fails completely if primary fails
      return await fetch(primarySource);
    } catch (error) {
      // Should gracefully degrade to fallback
      throw error; // Complete failure instead of degradation
    }
  }

  // SRE VIOLATION: No circuit breaker pattern
  async callExternalService(serviceUrl: string) {
    // No circuit breaker: Will keep failing if service is down
    // Should implement circuit breaker to fail fast
    return await fetch(serviceUrl);
  }

  // Helper methods
  private async getErrorRate(): Promise<number> {
    // Mock error rate calculation
    return Math.random() * 0.1; // 0-10% error rate
  }

  private async scaleUpResources() {
    // Manual scaling - should be automated
    console.log('Manually scaling up resources...');
  }

  private async doWork(request: any) {
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  }
}
