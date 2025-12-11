import { test, expect } from '@playwright/test';
import { CheckoutService } from '../services/CheckoutService';

test.describe('Checkout Service Integration Tests', () => {
  test('should process payment with old API', async () => {
    const checkoutService = new CheckoutService();
    
    // BREAKING CHANGE TEST: Using OLD signature
    // This will break when CheckoutService.processPayment() signature changes
    // Expected: DroogAI should detect this call uses old signature
    const result = await checkoutService.processPayment(100, '4111111111111111');
    
    expect(result.success).toBe(true);
  });

  test('should calculate tax with old API', () => {
    const checkoutService = new CheckoutService();
    
    // BREAKING CHANGE TEST: Using OLD signature (missing country parameter)
    // Expected: DroogAI should detect missing required parameter
    const tax = checkoutService.calculateTax(100); // Should be: calculateTax(100, 'US')
    
    expect(tax).toBeGreaterThan(0);
  });

  test('should handle payment validation', () => {
    const checkoutService = new CheckoutService();
    
    // Test card validation
    const isValid = checkoutService.validateCard('4111111111111111');
    expect(isValid).toBe(true);
  });
});

