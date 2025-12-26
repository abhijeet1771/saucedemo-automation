// PR #14 - REAL-TIME DATA PIPELINE: Streaming data processing and fault tolerance
// This PR demonstrates event-driven architecture with data quality and latency requirements

export interface DataEvent {
  id: string;
  type: 'user_action' | 'system_event' | 'business_metric' | 'error_log';
  timestamp: Date;
  payload: any;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  correlationId?: string;
}

export interface ProcessingResult {
  success: boolean;
  processedEvents: number;
  failedEvents: number;
  latency: number;
  errors: string[];
  outputData: any[];
}

// FAULT TOLERANCE: No error handling or retry logic
export class TestDataProcessor {
  private eventBuffer: DataEvent[] = [];
  private processingQueue: DataEvent[] = [];
  private isProcessing: boolean = false;

  // PERFORMANCE: No backpressure handling
  async processStreamingData(eventStream: AsyncIterable<DataEvent>): Promise<ProcessingResult> {
    const startTime = Date.now();
    let processedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    const outputData: any[] = [];

    // FAULT TOLERANCE: No timeout or circuit breaker
    try {
      for await (const event of eventStream) {
        // PERFORMANCE: Synchronous processing in async loop
        const result = await this.processSingleEvent(event);

        if (result.success) {
          processedCount++;
          outputData.push(result.data);
        } else {
          failedCount++;
          errors.push(result.error);
        }

        // PERFORMANCE: No batching or throttling
        await this.emitProcessedEvent(result);
      }
    } catch (error) {
      // FAULT TOLERANCE: Generic error handling
      errors.push(`Stream processing failed: ${error}`);
    }

    const latency = Date.now() - startTime;

    return {
      success: failedCount === 0,
      processedEvents: processedCount,
      failedEvents: failedCount,
      latency,
      errors,
      outputData
    };
  }

  // DATA QUALITY: No validation or schema checking
  async processEventBatch(events: DataEvent[]): Promise<ProcessingResult> {
    const startTime = Date.now();

    // PERFORMANCE: Process all events sequentially
    const results = await Promise.all(
      events.map(event => this.processSingleEvent(event))
    );

    const processedCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    const errors = results.filter(r => !r.success).map(r => r.error);
    const outputData = results.filter(r => r.success).map(r => r.data);

    return {
      success: failedCount === 0,
      processedEvents: processedCount,
      failedEvents: failedCount,
      latency: Date.now() - startTime,
      errors,
      outputData
    };
  }

  // FAULT TOLERANCE: No idempotency or duplicate handling
  private async processSingleEvent(event: DataEvent): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // DATA QUALITY: No schema validation
      if (!event.id || !event.type) {
        return { success: false, error: 'Invalid event structure' };
      }

      // PERFORMANCE: Blocking operations in event processing
      await this.validateEventData(event);
      await this.enrichEventData(event);
      await this.transformEventData(event);

      // DATA QUALITY: No data consistency checks
      const processedData = await this.applyBusinessLogic(event);

      // FAULT TOLERANCE: No transaction boundaries
      await this.persistProcessedData(processedData);

      return { success: true, data: processedData };

    } catch (error) {
      // FAULT TOLERANCE: Silent failures
      console.error(`Event processing failed: ${error}`);
      return { success: false, error: error.message };
    }
  }

  // PERFORMANCE: Inefficient data enrichment
  private async enrichEventData(event: DataEvent): Promise<void> {
    // PERFORMANCE: Multiple database calls for enrichment
    if (event.type === 'user_action') {
      event.payload.userProfile = await this.getUserProfile(event.payload.userId);
      event.payload.sessionData = await this.getUserSession(event.payload.sessionId);
      event.payload.deviceInfo = await this.getDeviceInfo(event.payload.deviceId);
    }

    // PERFORMANCE: External API calls without caching
    if (event.type === 'business_metric') {
      event.payload.marketData = await this.fetchMarketData(event.payload.symbol);
      event.payload.competitorData = await this.fetchCompetitorData(event.payload.industry);
    }
  }

  // DATA QUALITY: Complex transformation logic without error handling
  private async transformEventData(event: DataEvent): Promise<void> {
    // DATA QUALITY: Manual data transformation prone to errors
    if (event.payload.amount) {
      event.payload.amountUSD = event.payload.amount * await this.getExchangeRate(event.payload.currency);
    }

    if (event.payload.timestamp) {
      event.payload.processedAt = new Date().toISOString();
      event.payload.age = Date.now() - new Date(event.payload.timestamp).getTime();
    }

    // DATA QUALITY: Type coercion without validation
    if (event.payload.quantity) {
      event.payload.quantity = parseInt(event.payload.quantity);
    }
  }

  // PERFORMANCE: Complex business logic without optimization
  private async applyBusinessLogic(event: DataEvent): Promise<any> {
    const result: any = { ...event.payload };

    // PERFORMANCE: Nested conditional logic
    if (event.type === 'user_action' && event.payload.action === 'purchase') {
      result.revenue = event.payload.amount;
      result.margin = result.revenue * 0.3; // 30% margin

      // PERFORMANCE: Additional calculations
      result.customerLifetimeValue = await this.calculateCLV(event.payload.userId);
      result.purchaseProbability = await this.calculatePurchaseProbability(event.payload);
      result.churnRisk = await this.calculateChurnRisk(event.payload.userId);
    }

    return result;
  }

  // FAULT TOLERANCE: No connection pooling or retry logic
  private async persistProcessedData(data: any): Promise<void> {
    // FAULT TOLERANCE: Direct database connection without pooling
    const db = await this.getDatabaseConnection();

    try {
      await db.collection('processed_events').insertOne(data);
    } finally {
      await db.close(); // FAULT TOLERANCE: No connection reuse
    }
  }

  // PERFORMANCE: No caching for frequently accessed data
  private async getUserProfile(userId: string): Promise<any> {
    const db = await this.getDatabaseConnection();
    try {
      return await db.collection('users').findOne({ id: userId });
    } finally {
      await db.close();
    }
  }

  private async getUserSession(sessionId: string): Promise<any> {
    const db = await this.getDatabaseConnection();
    try {
      return await db.collection('sessions').findOne({ id: sessionId });
    } finally {
      await db.close();
    }
  }

  private async getDeviceInfo(deviceId: string): Promise<any> {
    const db = await this.getDatabaseConnection();
    try {
      return await db.collection('devices').findOne({ id: deviceId });
    } finally {
      await db.close();
    }
  }

  private async fetchMarketData(symbol: string): Promise<any> {
    // PERFORMANCE: No caching for market data
    const response = await fetch(`https://api.marketdata.com/symbols/${symbol}`);
    return response.json();
  }

  private async fetchCompetitorData(industry: string): Promise<any> {
    // PERFORMANCE: External API call without timeout
    const response = await fetch(`https://api.competitor.com/industry/${industry}`);
    return response.json();
  }

  private async getExchangeRate(currency: string): Promise<number> {
    // PERFORMANCE: No rate limiting or caching
    const response = await fetch(`https://api.exchangerate.com/rate/${currency}`);
    const data = await response.json();
    return data.rate;
  }

  private async calculateCLV(userId: string): Promise<number> {
    // PERFORMANCE: Complex calculation without optimization
    const userOrders = await this.getUserOrderHistory(userId);
    const averageOrderValue = userOrders.reduce((sum, order) => sum + order.amount, 0) / userOrders.length;
    const purchaseFrequency = userOrders.length / 365; // Annual frequency

    return averageOrderValue * purchaseFrequency * 3; // 3-year CLV
  }

  private async calculatePurchaseProbability(eventData: any): Promise<number> {
    // PERFORMANCE: Machine learning inference without optimization
    // Simulate ML model call
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
    return Math.random();
  }

  private async calculateChurnRisk(userId: string): Promise<number> {
    // PERFORMANCE: Multiple database queries for risk calculation
    const userActivity = await this.getUserActivity(userId);
    const lastLogin = await this.getLastLogin(userId);
    const supportTickets = await this.getSupportTickets(userId);

    // Complex risk calculation
    return Math.min(1, (Date.now() - lastLogin) / (30 * 24 * 60 * 60 * 1000)); // 30 days
  }

  private async emitProcessedEvent(result: any): Promise<void> {
    // FAULT TOLERANCE: Fire-and-forget event emission
    console.log('Emitted processed event:', result);
  }

  private async validateEventData(event: DataEvent): Promise<void> {
    // DATA QUALITY: Basic validation only
    if (!event.timestamp) {
      throw new Error('Event timestamp required');
    }
  }

  private async getDatabaseConnection(): Promise<any> {
    // FAULT TOLERANCE: No connection pooling
    return { collection: () => ({}), close: () => {} };
  }

  private async getUserOrderHistory(userId: string): Promise<any[]> {
    const db = await this.getDatabaseConnection();
    try {
      return await db.collection('orders').find({ userId }).toArray();
    } finally {
      await db.close();
    }
  }

  private async getUserActivity(userId: string): Promise<any> {
    const db = await this.getDatabaseConnection();
    try {
      return await db.collection('activity').findOne({ userId });
    } finally {
      await db.close();
    }
  }

  private async getLastLogin(userId: string): Promise<number> {
    const db = await this.getDatabaseConnection();
    try {
      const login = await db.collection('logins').findOne({ userId }, { sort: { timestamp: -1 } });
      return login ? login.timestamp : 0;
    } finally {
      await db.close();
    }
  }

  private async getSupportTickets(userId: string): Promise<any[]> {
    const db = await this.getDatabaseConnection();
    try {
      return await db.collection('support').find({ userId }).toArray();
    } finally {
      await db.close();
    }
  }
}
