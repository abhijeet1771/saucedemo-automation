// BREAKING CHANGE: Added new required interface
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

// BREAKING CHANGE: New required interface
export interface OrderOptions {
  priority: 'normal' | 'express' | 'urgent';
  notes?: string;
}

// BREAKING CHANGE: Changed return type from any to OrderResult
export interface OrderResult {
  orderId: number;
  userId: number;
  items: OrderItem[];
  status: string;
  createdAt: Date;
}

// BREAKING CHANGE: New enum for payment methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto'
}

// BREAKING CHANGE: Changed return type from object to PaymentResult
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  method: PaymentMethod;
  processedAt: Date;
}

// BREAKING CHANGE: Changed return type from string to OrderStatus
export interface OrderStatus {
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  lastUpdated: Date;
  estimatedDelivery: Date | null;
}

// BREAKING CHANGE: This will be modified in PR to test breaking change detection
export class OrderService {
  // BREAKING CHANGE: Changed items parameter from any[] to OrderItem[]
  async createOrder(userId: number, items: OrderItem[], options?: OrderOptions): Promise<OrderResult> {
    return {
      orderId: Math.random(),
      userId: userId,
      items: items,
      status: 'pending',
      createdAt: new Date()
    };
  }

  // BREAKING CHANGE: Changed from public to private (visibility change)
  // BREAKING CHANGE: Added required paymentMethod parameter
  private processPayment(orderId: number, amount: number, paymentMethod: PaymentMethod): PaymentResult {
    // Payment processing
    return {
      success: true,
      transactionId: 'txn-123',
      method: paymentMethod,
      processedAt: new Date()
    };
  }

  // BREAKING CHANGE: Changed return type from string to OrderStatus
  getOrderStatus(orderId: number): OrderStatus {
    return {
      status: 'pending',
      lastUpdated: new Date(),
      estimatedDelivery: null
    };
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

