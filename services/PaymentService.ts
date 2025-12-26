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

  private async executeQuery(query: string) {
    // Mock implementation
    return [];
  }
}

// SECURITY: Weak password hashing
export function hashPassword(password: string): string {
  const crypto = require('crypto');
  // SECURITY: MD5 is cryptographically broken
  return crypto.createHash('md5').update(password).digest('hex');
}

// SECURITY: No rate limiting
export class AuthLimiter {
  private attempts: Map<string, number> = new Map();

  checkRateLimit(ip: string): boolean {
    // SECURITY: No rate limiting implementation
    return true; // Always allow
  }
}
