/**
 * Checkout Service
 * Handles checkout and payment processing
 * 
 * BREAKING CHANGES IN THIS PR:
 * 1. processPayment() signature changed - will break all callers
 * 2. calculateTax() now requires country parameter - will break all callers
 */

export interface PaymentData {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export class CheckoutService {
  /**
   * Process payment
   * BREAKING CHANGE: Signature changed from processPayment(amount, cardNumber)
   * to processPayment(paymentData: PaymentData)
   * 
   * OLD: processPayment(100, '4111111111111111')
   * NEW: processPayment({ amount: 100, cardNumber: '4111...', ... })
   * 
   * This will break:
   * - Any file calling processPayment() with old signature
   * - Expected to find in: CartPage.ts, OrderService.ts, tests
   */
  async processPayment(paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string }> {
    // ISSUE: CRITICAL - Hardcoded API key (Line 30)
    const apiKey = 'sk-live-1234567890abcdef'; // Should use environment variable!
    
    // Validate payment data
    if (!paymentData.cardNumber || paymentData.cardNumber.length !== 16) {
      throw new Error('Invalid card number');
    }

    // Call payment API
    const response = await fetch('https://api.payment.com/charge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`Payment failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      transactionId: result.transactionId
    };
  }

  /**
   * Calculate tax for order
   * BREAKING CHANGE: Now requires country parameter
   * 
   * OLD: calculateTax(100) → returns tax for default country
   * NEW: calculateTax(100, 'US') → requires country parameter
   * 
   * This will break:
   * - OrderService.calculateTotal() - calls calculateTax(amount)
   * - CartPage.getFinalPrice() - calls calculateTax(total)
   * - Any test files using calculateTax()
   */
  calculateTax(amount: number, country: string): number {
    const taxRates: Record<string, number> = {
      'US': 0.08,
      'CA': 0.13,
      'UK': 0.20,
      'IN': 0.18
    };

    const rate = taxRates[country] || 0.10;
    return amount * rate;
  }

  /**
   * Calculate discount
   * ISSUE: Division by zero potential (Line 55)
   */
  calculateDiscount(total: number, discountRate: number): number {
    // ISSUE: No validation - what if discountRate is 0?
    const discount = total / discountRate; // Should be: total * discountRate
    return discount;
  }

  /**
   * Validate payment card
   */
  validateCard(cardNumber: string): boolean {
    // Simple Luhn algorithm check
    if (!cardNumber || cardNumber.length !== 16) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < cardNumber.length; i++) {
      let digit = parseInt(cardNumber[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }
}

