// ARCHITECTURE VIOLATION: Service layer directly accessing database
// ARCHITECTURE VIOLATION: No abstraction layer for data access
export class OrderService {
  // ARCHITECTURE VIOLATION: Direct database connection in service layer
  private dbConnection: any = null;

  constructor() {
    // ARCHITECTURE VIOLATION: Direct database instantiation in constructor
    this.dbConnection = this.createDatabaseConnection();
  }

  // ARCHITECTURE VIOLATION: Direct database queries in service methods
  async createOrder(userId: number, items: OrderItem[], options?: OrderOptions): Promise<OrderResult> {
    // ARCHITECTURE VIOLATION: Business logic mixed with data access
    const total = this.calculateTotal(items);

    // ARCHITECTURE VIOLATION: Direct SQL execution in service
    const query = `
      INSERT INTO orders (user_id, total_amount, status, created_at)
      VALUES ($1, $2, 'pending', NOW())
      RETURNING order_id
    `;

    // ARCHITECTURE VIOLATION: Direct database interaction
    const result = await this.dbConnection.query(query, [userId, total]);

    const orderId = result.rows[0].order_id;

    // ARCHITECTURE VIOLATION: More direct database operations
    for (const item of items) {
      await this.dbConnection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    return {
      orderId,
      userId,
      items,
      status: 'pending',
      createdAt: new Date()
    };
  }

  // ARCHITECTURE VIOLATION: Business logic in service instead of domain layer
  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // ARCHITECTURE VIOLATION: Direct database connection creation
  private createDatabaseConnection(): any {
    // ARCHITECTURE VIOLATION: Infrastructure concern in business logic
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    client.connect();
    return client;
  }

  // ARCHITECTURE VIOLATION: Service method doing UI concerns (email sending)
  async sendOrderConfirmation(orderId: number, userEmail: string): Promise<void> {
    // ARCHITECTURE VIOLATION: Direct email sending in service layer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ARCHITECTURE VIOLATION: UI/infrastructure logic in service
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmation',
      html: `<h1>Order #${orderId} Confirmed!</h1>`
    };

    await transporter.sendMail(mailOptions);
  }

  // ARCHITECTURE VIOLATION: Service directly handling HTTP responses
  async processOrderPayment(orderId: number, paymentData: any): Promise<any> {
    // ARCHITECTURE VIOLATION: Direct HTTP calls in service layer
    const axios = require('axios');

    try {
      const response = await axios.post('https://payment-gateway.com/process', {
        orderId,
        amount: paymentData.amount,
        cardToken: paymentData.token
      });

      // ARCHITECTURE VIOLATION: Direct database update in service
      await this.dbConnection.query(
        'UPDATE orders SET status = $1 WHERE order_id = $2',
        ['paid', orderId]
      );

      return response.data;
    } catch (error) {
      // ARCHITECTURE VIOLATION: Direct error handling with side effects
      await this.dbConnection.query(
        'UPDATE orders SET status = $1 WHERE order_id = $2',
        ['payment_failed', orderId]
      );
      throw error;
    }
  }

  // ARCHITECTURE VIOLATION: Static method creating tight coupling
  static async processBulkOrders(orders: any[]): Promise<any[]> {
    // ARCHITECTURE VIOLATION: Static method accessing instance dependencies
    const service = new OrderService();
    const results = [];

    for (const order of orders) {
      try {
        const result = await service.createOrder(order.userId, order.items);
        results.push(result);
      } catch (error) {
        // ARCHITECTURE VIOLATION: Silent error handling
        console.log(`Failed to process order: ${error}`);
      }
    }

    return results;
  }
}

// ARCHITECTURE VIOLATION: Tight coupling between services
export class OrderNotificationService {
  // ARCHITECTURE VIOLATION: Direct instantiation of another service
  private orderService = new OrderService();

  async notifyOrderStatus(orderId: number): Promise<void> {
    // ARCHITECTURE VIOLATION: Cross-service direct calls
    const order = await this.getOrderFromDatabase(orderId);

    if (order.status === 'completed') {
      // ARCHITECTURE VIOLATION: Direct email logic in notification service
      await this.sendEmailNotification(order.userEmail, 'Order Completed', `Your order ${orderId} is ready!`);
    }
  }

  // ARCHITECTURE VIOLATION: Direct database access in notification service
  private async getOrderFromDatabase(orderId: number): Promise<any> {
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
      const result = await client.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: Direct email implementation
  private async sendEmailNotification(to: string, subject: string, body: string): Promise<void> {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body
    });
  }
}

// ARCHITECTURE VIOLATION: God object/service with multiple responsibilities
export class OrderManagementService {
  private dbConnection: any = null;

  constructor() {
    this.initializeDatabase();
  }

  // ARCHITECTURE VIOLATION: Single service handling orders, payments, inventory, shipping
  async processCompleteOrder(orderData: any): Promise<any> {
    // Responsibility 1: Order creation
    const order = await this.createOrder(orderData);

    // Responsibility 2: Payment processing
    await this.processPayment(order.orderId, orderData.payment);

    // Responsibility 3: Inventory management
    await this.updateInventory(order.items);

    // Responsibility 4: Shipping coordination
    await this.arrangeShipping(order.orderId, orderData.shipping);

    // Responsibility 5: Notification
    await this.sendNotifications(order);

    return order;
  }

  private async createOrder(orderData: any): Promise<any> {
    // Direct database operations
    const query = 'INSERT INTO orders (...) VALUES (...)';
    return await this.dbConnection.query(query, []);
  }

  private async processPayment(orderId: number, paymentData: any): Promise<void> {
    // Direct payment gateway calls
    const axios = require('axios');
    await axios.post('https://payment-gateway.com/process', paymentData);
  }

  private async updateInventory(items: any[]): Promise<void> {
    // Direct inventory updates
    for (const item of items) {
      await this.dbConnection.query('UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2', [item.quantity, item.productId]);
    }
  }

  private async arrangeShipping(orderId: number, shippingData: any): Promise<void> {
    // Direct shipping API calls
    const axios = require('axios');
    await axios.post('https://shipping-api.com/arrange', { orderId, ...shippingData });
  }

  private async sendNotifications(order: any): Promise<void> {
    // Direct email sending
    const nodemailer = require('nodemailer');
    // Email implementation...
  }

  private async initializeDatabase(): Promise<void> {
    const { Client } = require('pg');
    this.dbConnection = new Client({ /* config */ });
    await this.dbConnection.connect();
  }
}

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

