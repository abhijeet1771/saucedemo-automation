// PR #11 - LEGACY SYSTEM MODERNIZATION: Migrating from legacy payment system
// This PR demonstrates high-risk financial system changes with regulatory compliance

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  customerId: string;
  merchantId: string;
  createdAt: Date;
  processedAt?: Date;
  failureReason?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet';
  lastFour?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// BREAKING CHANGE: Legacy system interface replacement
export class LegacyPaymentAdapter {
  // HIGH RISK: Legacy system integration with modern API
  async processLegacyPayment(legacyTransaction: any): Promise<PaymentResult> {
    // LEGACY COMPATIBILITY: Complex data transformation
    const modernTransaction = this.transformLegacyToModern(legacyTransaction);

    try {
      // MODERN PROCESSING: New payment processor
      const result = await this.processWithModernSystem(modernTransaction);

      // LEGACY SYNC: Update legacy system for backward compatibility
      await this.syncResultToLegacySystem(legacyTransaction.id, result);

      return result;

    } catch (error) {
      // FALLBACK: Legacy processing if modern fails
      console.warn('Modern payment failed, falling back to legacy system');
      return await this.fallbackToLegacyProcessing(legacyTransaction);
    }
  }

  // DATA MIGRATION: Complex schema transformation
  private transformLegacyToModern(legacy: any): PaymentTransaction {
    return {
      id: legacy.transactionId,
      amount: legacy.amountInCents / 100, // Convert cents to dollars
      currency: legacy.currency || 'USD',
      status: this.mapLegacyStatus(legacy.status),
      paymentMethod: this.mapLegacyPaymentMethod(legacy.paymentType),
      customerId: legacy.customerId,
      merchantId: legacy.merchantId,
      createdAt: new Date(legacy.timestamp),
    };
  }

  private mapLegacyStatus(legacyStatus: string): PaymentTransaction['status'] {
    const statusMap: { [key: string]: PaymentTransaction['status'] } = {
      'PENDING': 'pending',
      'PROCESSING': 'processing',
      'APPROVED': 'completed',
      'DECLINED': 'failed',
      'REFUNDED': 'refunded'
    };
    return statusMap[legacyStatus] || 'pending';
  }

  private mapLegacyPaymentMethod(legacyType: string): PaymentMethod {
    const methodMap: { [key: string]: PaymentMethod['type'] } = {
      'CC': 'credit_card',
      'DC': 'debit_card',
      'ACH': 'bank_transfer',
      'PAYPAL': 'digital_wallet'
    };

    return {
      type: methodMap[legacyType] || 'credit_card'
    };
  }

  private async processWithModernSystem(transaction: PaymentTransaction): Promise<PaymentResult> {
    // Simulate modern payment processing
    return {
      success: true,
      transactionId: transaction.id,
      processedAt: new Date(),
      fees: this.calculateProcessingFees(transaction)
    };
  }

  private async syncResultToLegacySystem(legacyId: string, result: PaymentResult): Promise<void> {
    // Update legacy system with modern results
    console.log(`Syncing result for legacy transaction ${legacyId}`);
  }

  private async fallbackToLegacyProcessing(legacyTransaction: any): Promise<PaymentResult> {
    // Direct legacy system integration
    const legacyResult = await this.callLegacyAPI(legacyTransaction);

    return {
      success: legacyResult.approved,
      transactionId: legacyResult.transactionId,
      processedAt: new Date(),
      fees: legacyResult.fees
    };
  }

  private async callLegacyAPI(transaction: any): Promise<any> {
    // Simulate legacy API call
    return {
      approved: Math.random() > 0.1, // 90% success rate
      transactionId: transaction.transactionId,
      fees: 0.30
    };
  }

  private calculateProcessingFees(transaction: PaymentTransaction): number {
    // Complex fee calculation based on payment method and amount
    const baseFee = 0.30;
    const percentageFee = transaction.amount * 0.029; // 2.9%

    if (transaction.paymentMethod.type === 'international') {
      return baseFee + percentageFee + 0.50; // International fee
    }

    return baseFee + percentageFee;
  }
}

// SECURITY: Insecure payment processing service
export class PaymentService {
  private apiKey = 'pk_live_payment_key_12345'; // Hardcoded API key
  private dbConnectionString = 'postgresql://admin:password123@localhost/payments'; // Exposed credentials

  // SECURITY: Path traversal vulnerability
  async processRefund(transactionId: string, refundFile: string) {
    // SECURITY: Path traversal - user input not validated
    const filePath = `./refunds/${refundFile}`;
    const fs = require('fs');

    // This could access: ../../../../etc/passwd
    const refundData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(refundData);
  }

  // SECURITY: SQL injection in payment queries
  async getPaymentHistory(userId: string, startDate: string, endDate: string) {
    // SECURITY: SQL injection vulnerability
    const query = `
      SELECT * FROM payments
      WHERE user_id = '${userId}'
      AND created_at BETWEEN '${startDate}' AND '${endDate}'
    `;

    // If userId is: ' OR '1'='1
    // Query becomes: SELECT * FROM payments WHERE user_id = '' OR '1'='1' AND ...

    return this.executeQuery(query);
  }

  // SECURITY: Weak encryption
  encryptCardData(cardNumber: string): string {
    // SECURITY: Using weak encryption
    const crypto = require('crypto');
    const key = 'weak-key-123'; // Weak key
    const cipher = crypto.createCipher('aes-128-ecb', key); // ECB mode is insecure

    return cipher.update(cardNumber, 'utf8', 'hex') + cipher.final('hex');
  }

  // SECURITY: Information disclosure
  async logPaymentError(error: any, userId: string) {
    console.log(`Payment error for user ${userId}:`, {
      error: error.message,
      stack: error.stack, // SECURITY: Stack trace exposure
      userId: userId,
      timestamp: new Date(),
      environment: process.env.NODE_ENV, // Could leak environment info
      serverVersion: process.version // Could leak server version
    });
  }

  private async executeQuery(query: string): Promise<any[]> {
    // Simulate database query execution
    console.log('Executing query:', query);
    return [];
  }
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  processedAt: Date;
  fees: number;
}
