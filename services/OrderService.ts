// BREAKING CHANGES INTRODUCED: Testing ARCHON breaking change detection
export class OrderService {
  // BREAKING CHANGE: Method signature completely changed
  async createOrder(orderData: {userId: number, items: any[], metadata?: any}): Promise<{orderId: string, status: string}> {
    // SECURITY ISSUE: Hardcoded API key
    const apiKey = "sk-1234567890abcdef"; // This should be detected

    return {
      orderId: `order-${Math.random().toString(36).substr(2, 9)}`,
      status: 'created'
    };
  }

  // BREAKING CHANGE: Changed from public to private
  private processPayment(orderId: number, amount: number) {
    // ARCHITECTURAL ISSUE: Direct database call in service layer
    const db = require('some-db-lib');
    return { success: true, transactionId: 'txn-123' };
  }

  // BREAKING CHANGE: Return type changed from string to object
  getOrderStatus(orderId: number): {status: string, timestamp: Date} {
    return { status: 'pending', timestamp: new Date() };
  }

  // BREAKING CHANGE: Parameter order changed
  validateOrder(amount: number, currency: string = 'USD', tax?: number): boolean {
    if (amount < 0) return false;
    return true;
  }

  // COMPLEXITY: High cognitive complexity
  calculateTotal(items: any[], discount: number, tax: number, shipping: number, applyDiscount: boolean, applyTax: boolean, applyShipping: boolean) {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    if (applyDiscount) {
      if (discount > 0) {
        if (discount < 100) {
          total = total * (1 - discount / 100);
        } else {
          total = 0;
        }
      }
    }
    if (applyTax) {
      if (tax > 0) {
        total = total * (1 + tax / 100);
      }
    }
    if (applyShipping) {
      if (shipping > 0) {
        total += shipping;
      }
    }
    return total;
  }

  // SECURITY: SQL Injection vulnerability
  async getOrdersByUser(userId: string) {
    // SQL INJECTION: Direct string concatenation
    const query = `SELECT * FROM orders WHERE user_id = '${userId}'`;
    return this.executeQuery(query);
  }

  // SECURITY: XSS vulnerability
  generateOrderHTML(orderId: string, userInput: string) {
    // XSS: Direct HTML injection
    return `<div>Order ${orderId}: ${userInput}</div>`;
  }

  // PERFORMANCE: Memory leak
  private orderCache = new Map();
  cacheOrder(order: any) {
    this.orderCache.set(order.id, order);
    // MEMORY LEAK: No cleanup, cache grows indefinitely
  }

  // NULL SAFETY: No null checks
  processRefund(orderId: string, amount: number) {
    const order = this.getOrderById(orderId);
    // NULL SAFETY VIOLATION: No null check before accessing properties
    return order.status === 'paid' ? amount * 0.9 : 0;
  }

  // SRE: Missing error handling and SLO definition
  async submitOrder(order: any) {
    try {
      // NO TIMEOUT: Can hang indefinitely
      const result = await fetch('https://api.payment.com/process', {
        method: 'POST',
        body: JSON.stringify(order)
      });
      return result.json();
    } catch (error) {
      // POOR ERROR HANDLING: Generic catch-all
      console.log('Error:', error);
      throw error;
    }
  }

  // HERMETIC TESTING VIOLATION: External dependency
  private executeQuery(query: string) {
    // External database call makes tests non-hermetic
    return require('database-driver').query(query);
  }
}

