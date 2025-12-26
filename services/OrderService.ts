// BREAKING CHANGE: This will be modified in PR to test breaking change detection
export class OrderService {
  // Original method signature (in master)
  async createOrder(userId: number, items: any[]): Promise<any> {
    return {
      orderId: Math.random(),
      userId: userId,
      items: items,
      status: 'pending'
    };
  }

  // Method that will be changed in PR (visibility change)
  public processPayment(orderId: number, amount: number) {
    // Payment processing
    return { success: true, transactionId: 'txn-123' };
  }

  // Method that will change return type in PR
  getOrderStatus(orderId: number): string {
    return 'pending';
  }

  // SECURITY: Command injection vulnerability
  async executePayment(orderId: number, paymentData: any) {
    const { amount, method } = paymentData;

    // SECURITY: Command injection - user input passed to shell command
    const command = `curl -X POST https://payment-gateway.com/pay \\
      -d "amount=${amount}" \\
      -d "orderId=${orderId}" \\
      -H "Authorization: Bearer ${paymentData.token}"`;

    // This could execute: curl ... -d "amount=100; rm -rf /;" ...

    return { success: true };
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

  // OBSERVABILITY: Missing logging
  async submitOrder(order: any) {
    // Should log: "Submitting order: {orderId}"
    const result = await this.createOrder(order.userId, order.items);
    // Should log: "Order submitted successfully: {orderId}" or error
    return result;
  }
}

