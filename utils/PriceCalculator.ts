/**
 * Price Calculator Utility
 * Calculates prices, taxes, and discounts
 */

export interface Product {
  id: string;
  name: string;
  price: number | null; // Can be null!
  quantity: number;
}

export interface PriceItem {
  name: string;
  price: number;
}

export class PriceCalculator {
  /**
   * Calculate total price for a product
   * ISSUE: Missing null check (Line 18)
   */
  calculateProductTotal(product: Product): number {
    // ISSUE: product.price can be null - no null check!
    const price = product.price * product.quantity; // Can throw error if price is null
    return price;
  }

  /**
   * Calculate average price
   * ISSUE: Division by zero (Line 25)
   */
  calculateAveragePrice(items: PriceItem[]): number {
    if (items.length === 0) {
      return 0;
    }

    const total = items.reduce((sum, item) => sum + item.price, 0);
    // ISSUE: No check - what if items array was mutated and is now empty?
    const average = total / items.length; // Can divide by zero if items.length becomes 0
    return average;
  }

  /**
   * Calculate tax amount
   * ISSUE: Missing validation (Line 35)
   */
  calculateTax(amount: number, taxRate: number): number {
    // ISSUE: No validation - taxRate could be negative or > 1
    // Should validate: if (taxRate < 0 || taxRate > 1) throw error
    const tax = amount * taxRate;
    return tax;
  }

  /**
   * Format price list as string
   * ISSUE: String concatenation in loop (Line 42) - Performance issue
   */
  formatPriceList(items: PriceItem[]): string {
    let result = '';
    // ISSUE: String concatenation in loop - O(n²) complexity
    // Should use: items.map(...).join('\n') or template literals
    for (const item of items) {
      result += item.name + ': ' + item.price + '\n'; // Inefficient!
    }
    return result;
  }

  /**
   * Calculate discount amount
   */
  calculateDiscount(price: number, discountPercent: number): number {
    return price * (discountPercent / 100);
  }

  /**
   * Calculate final price with tax and discount
   */
  calculateFinalPrice(
    basePrice: number,
    taxRate: number,
    discountPercent: number
  ): number {
    const discount = this.calculateDiscount(basePrice, discountPercent);
    const priceAfterDiscount = basePrice - discount;
    const tax = this.calculateTax(priceAfterDiscount, taxRate);
    return priceAfterDiscount + tax;
  }
}

