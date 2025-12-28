// ARCHITECTURE VIOLATION: UI layer directly calling business services
// ARCHITECTURE VIOLATION: Page Object Model violating separation of concerns
import { OrderService, OrderManagementService } from '../services/OrderService';
import { UserService } from '../services/UserService';

export class OrderPage {
  private page: any;
  // ARCHITECTURE VIOLATION: Page object directly instantiating services
  private orderService = new OrderService();
  private userService = new UserService();
  private orderManagementService = new OrderManagementService();

  constructor(page: any) {
    this.page = page;
  }

  // ARCHITECTURE VIOLATION: UI method calling multiple services directly
  async placeCompleteOrder(userEmail: string, products: any[]): Promise<any> {
    // ARCHITECTURE VIOLATION: Page object doing business logic
    const user = await this.userService.authenticateUser(userEmail, 'password123');

    if (!user) {
      throw new Error('User authentication failed');
    }

    // ARCHITECTURE VIOLATION: Page object directly calling order service
    const order = await this.orderService.createOrder(user.user_id, products);

    // ARCHITECTURE VIOLATION: Page object handling payment (UI concern)
    await this.orderService.processOrderPayment(order.orderId, {
      amount: this.calculateOrderTotal(products),
      token: 'test-payment-token'
    });

    // ARCHITECTURE VIOLATION: Page object sending notifications (UI concern)
    await this.orderService.sendOrderConfirmation(order.orderId, userEmail);

    return order;
  }

  // ARCHITECTURE VIOLATION: Page object doing business calculations
  private calculateOrderTotal(products: any[]): number {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  // ARCHITECTURE VIOLATION: Page object managing complex workflows
  async manageOrderLifecycle(orderId: number): Promise<void> {
    // ARCHITECTURE VIOLATION: Page object calling management service
    const orderData = {
      userId: 123,
      items: [{ productId: 'test', quantity: 1, price: 10 }],
      payment: { amount: 10, token: 'test' },
      shipping: { address: '123 Test St', method: 'standard' }
    };

    // ARCHITECTURE VIOLATION: UI layer orchestrating business workflows
    await this.orderManagementService.processCompleteOrder(orderData);
  }

  // ARCHITECTURE VIOLATION: Page object doing data validation (business logic)
  async validateOrderData(orderData: any): Promise<boolean> {
    // ARCHITECTURE VIOLATION: UI doing business validation
    if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
      return false;
    }

    // ARCHITECTURE VIOLATION: UI doing business calculations
    const total = orderData.items.reduce((sum: number, item: any) =>
      sum + (item.price * item.quantity), 0);

    if (total <= 0) {
      return false;
    }

    // ARCHITECTURE VIOLATION: UI checking business rules
    for (const item of orderData.items) {
      if (item.quantity <= 0 || item.price <= 0) {
        return false;
      }
    }

    return true;
  }

  // ARCHITECTURE VIOLATION: Page object managing state (should be in business layer)
  private orderState: Map<number, any> = new Map();

  async trackOrderStatus(orderId: number): Promise<string> {
    // ARCHITECTURE VIOLATION: Page object maintaining business state
    let status = this.orderState.get(orderId);

    if (!status) {
      // ARCHITECTURE VIOLATION: UI directly querying database
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
        const result = await client.query('SELECT status FROM orders WHERE order_id = $1', [orderId]);
        status = result.rows[0]?.status || 'unknown';
        this.orderState.set(orderId, status);
      } finally {
        await client.end();
      }
    }

    return status;
  }

  // ARCHITECTURE VIOLATION: Page object handling errors and retries (infrastructure concern)
  async placeOrderWithRetry(userEmail: string, products: any[], maxRetries: number = 3): Promise<any> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // ARCHITECTURE VIOLATION: UI orchestrating retry logic
        return await this.placeCompleteOrder(userEmail, products);
      } catch (error) {
        lastError = error;
        console.log(`Order attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          // ARCHITECTURE VIOLATION: UI handling sleep/retry logic
          await this.page.waitForTimeout(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw new Error(`Order placement failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  // ARCHITECTURE VIOLATION: Page object doing API calls (infrastructure in UI)
  async fetchProductDetails(productIds: string[]): Promise<any[]> {
    const axios = require('axios');

    try {
      // ARCHITECTURE VIOLATION: UI making direct API calls
      const response = await axios.get('https://api.product-service.com/products', {
        params: { ids: productIds.join(',') }
      });

      return response.data.products;
    } catch (error) {
      // ARCHITECTURE VIOLATION: UI handling API errors
      console.error('Failed to fetch product details:', error);
      return [];
    }
  }

  // ARCHITECTURE VIOLATION: Page object managing caching (infrastructure concern)
  private productCache: Map<string, any> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getCachedProductDetails(productId: string): Promise<any> {
    // ARCHITECTURE VIOLATION: UI managing caching logic
    const cached = this.productCache.get(productId);

    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data;
    }

    // ARCHITECTURE VIOLATION: UI making direct API calls for caching
    const axios = require('axios');
    const response = await axios.get(`https://api.product-service.com/products/${productId}`);

    const productData = {
      data: response.data,
      timestamp: Date.now()
    };

    this.productCache.set(productId, productData);
    return productData.data;
  }
}

// ARCHITECTURE VIOLATION: Factory pattern with tight coupling
export class OrderPageFactory {
  // ARCHITECTURE VIOLATION: Factory creating concrete implementations
  static createOrderPage(page: any): OrderPage {
    return new OrderPage(page);
  }

  // ARCHITECTURE VIOLATION: Factory doing configuration
  static createConfiguredOrderPage(page: any, config: any): OrderPage {
    const orderPage = new OrderPage(page);

    // ARCHITECTURE VIOLATION: Factory modifying created objects
    if (config.enableCaching) {
      // Direct object manipulation
    }

    return orderPage;
  }
}
