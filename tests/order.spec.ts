// ARCHITECTURE VIOLATION: Test file directly importing and using services
// ARCHITECTURE VIOLATION: Test coupling with implementation details
import { test, expect } from '@playwright/test';
import { OrderService, OrderManagementService } from '../services/OrderService';
import { UserService } from '../services/UserService';
import { OrderPage } from '../pages/OrderPage';

test.describe('Order Management Tests', () => {
  // ARCHITECTURE VIOLATION: Test directly instantiating services
  let orderService: OrderService;
  let userService: UserService;
  let orderManagementService: OrderManagementService;

  test.beforeEach(() => {
    // ARCHITECTURE VIOLATION: Test managing service lifecycles
    orderService = new OrderService();
    userService = new UserService();
    orderManagementService = new OrderManagementService();
  });

  test('should create order through service layer', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test directly calling service methods
    const user = await userService.authenticateUser('test@example.com', 'password123');

    const orderItems = [
      { productId: 'product-1', quantity: 2, price: 10.99, name: 'Test Product' },
      { productId: 'product-2', quantity: 1, price: 25.50, name: 'Another Product' }
    ];

    // ARCHITECTURE VIOLATION: Test knowing service implementation details
    const order = await orderService.createOrder(user.user_id, orderItems);

    expect(order.orderId).toBeDefined();
    expect(order.status).toBe('pending');
    expect(order.items).toHaveLength(2);
  });

  test('should process complete order workflow', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test orchestrating multiple services
    const orderPage = new OrderPage(page);

    const orderData = {
      userId: 123,
      items: [
        { productId: 'test-product', quantity: 1, price: 29.99, name: 'Test Product' }
      ],
      payment: {
        amount: 29.99,
        token: 'test-payment-token-12345'
      },
      shipping: {
        address: '123 Test Street, Test City, TC 12345',
        method: 'standard'
      }
    };

    // ARCHITECTURE VIOLATION: Test calling god service method
    const result = await orderManagementService.processCompleteOrder(orderData);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
  });

  test('should handle order lifecycle through page object', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using page object that violates separation of concerns
    const orderPage = new OrderPage(page);

    // ARCHITECTURE VIOLATION: Page object doing business logic
    await orderPage.placeCompleteOrder('test@example.com', [
      { productId: 'lifecycle-test', quantity: 1, price: 15.99, name: 'Lifecycle Test' }
    ]);

    // ARCHITECTURE VIOLATION: Page object managing business workflows
    await orderPage.manageOrderLifecycle(1);
  });

  test('should validate order data in UI layer', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using page object for business validation
    const orderPage = new OrderPage(page);

    // Valid order data
    const validOrder = {
      userId: 123,
      items: [{ productId: 'valid', quantity: 1, price: 10 }]
    };

    // ARCHITECTURE VIOLATION: UI layer doing business validation
    const isValid = await orderPage.validateOrderData(validOrder);
    expect(isValid).toBe(true);

    // Invalid order data
    const invalidOrder = {
      userId: null,
      items: []
    };

    const isInvalid = await orderPage.validateOrderData(invalidOrder);
    expect(isInvalid).toBe(false);
  });

  test('should track order status with state management', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using page object for state management
    const orderPage = new OrderPage(page);

    // ARCHITECTURE VIOLATION: Page object maintaining business state
    const status = await orderPage.trackOrderStatus(1);
    expect(typeof status).toBe('string');
  });

  test('should handle order placement with retry logic', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using page object for infrastructure concerns
    const orderPage = new OrderPage(page);

    // ARCHITECTURE VIOLATION: UI layer handling retry logic
    await orderPage.placeOrderWithRetry('test@example.com', [
      { productId: 'retry-test', quantity: 1, price: 9.99, name: 'Retry Test' }
    ]);
  });

  test('should fetch product details from API', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using page object for API calls
    const orderPage = new OrderPage(page);

    // ARCHITECTURE VIOLATION: UI layer making direct API calls
    const products = await orderPage.fetchProductDetails(['product-1', 'product-2']);

    expect(Array.isArray(products)).toBe(true);
  });

  test('should use cached product details', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using page object for caching
    const orderPage = new OrderPage(page);

    // First call - should hit API
    const product1 = await orderPage.getCachedProductDetails('cached-product-1');

    // Second call - should use cache
    const product2 = await orderPage.getCachedProductDetails('cached-product-1');

    // ARCHITECTURE VIOLATION: UI layer managing caching infrastructure
    expect(product1).toEqual(product2);
  });

  test('should register user with cross-service dependencies', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test calling service with circular dependencies
    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User'
    };

    // ARCHITECTURE VIOLATION: Service doing multiple responsibilities
    const user = await userService.registerUser(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  test('should handle password reset workflow', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test calling service that handles multiple concerns
    await userService.resetPassword('existing@example.com');

    // This test would need email interception, but demonstrates
    // the architectural violation of service handling auth + email
  });

  test('should generate user audit reports', async ({ page }) => {
    // ARCHITECTURE VIOLATION: Test using audit service for reporting
    const { UserAuditService } = require('../services/UserService');
    const auditService = new UserAuditService();

    // ARCHITECTURE VIOLATION: Audit service doing reporting
    const report = await auditService.generateUserReport(1);

    expect(report).toBeDefined();
    expect(report.user).toBeDefined();
    expect(report.auditTrail).toBeDefined();
  });
});

// ARCHITECTURE VIOLATION: Test utilities with tight coupling
export class OrderTestHelper {
  // ARCHITECTURE VIOLATION: Helper directly instantiating services
  private orderService = new OrderService();
  private userService = new UserService();

  // ARCHITECTURE VIOLATION: Helper doing setup that should be in fixtures
  async setupTestOrder(): Promise<any> {
    const user = await this.userService.authenticateUser('test@example.com', 'password123');
    const order = await this.orderService.createOrder(user.user_id, [
      { productId: 'helper-product', quantity: 1, price: 19.99, name: 'Helper Product' }
    ]);

    return order;
  }

  // ARCHITECTURE VIOLATION: Helper doing teardown that should be in fixtures
  async cleanupTestOrder(orderId: number): Promise<void> {
    // Direct database cleanup
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    try {
      await client.query('DELETE FROM orders WHERE order_id = $1', [orderId]);
    } finally {
      await client.end();
    }
  }
}
