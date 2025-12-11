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

  // BREAKING CHANGE TEST: Calls CheckoutService.processPayment() with OLD signature
  // This will break when CheckoutService.processPayment() signature changes
  async processOrderPayment(orderId: number, amount: number, cardNumber: string) {
    const { CheckoutService } = await import('./CheckoutService');
    const checkoutService = new CheckoutService();
    // OLD SIGNATURE - will break! Should be: processPayment({ amount, cardNumber, ... })
    return await checkoutService.processPayment(amount, cardNumber);
  }

  // BREAKING CHANGE TEST: Calls CheckoutService.calculateTax() with OLD signature
  // This will break when calculateTax() requires country parameter
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
      const { CheckoutService } = require('./CheckoutService');
      const checkoutService = new CheckoutService();
      // OLD SIGNATURE - missing country parameter!
      const taxAmount = checkoutService.calculateTax(total); // Should be: calculateTax(total, 'US')
      total += taxAmount;
    }
    if (applyShipping) {
      if (shipping > 0) {
        total += shipping;
      }
    }
    return total;
  }

  // Method that will change return type in PR
  getOrderStatus(orderId: number): string {
    return 'pending';
  }


  // OBSERVABILITY: Missing logging
  async submitOrder(order: any) {
    // Should log: "Submitting order: {orderId}"
    const result = await this.createOrder(order.userId, order.items);
    // Should log: "Order submitted successfully: {orderId}" or error
    return result;
  }
}

