// ARCHITECTURE VIOLATION: Infrastructure concerns not properly abstracted
// ARCHITECTURE VIOLATION: Direct external service integrations in utility layer

export class PaymentGatewayIntegration {
  // ARCHITECTURE VIOLATION: Direct HTTP client usage without abstraction
  async processPayment(orderId: string, amount: number, cardDetails: any): Promise<any> {
    const axios = require('axios');

    // ARCHITECTURE VIOLATION: Infrastructure logic in business utility
    const paymentData = {
      orderId,
      amount,
      card: {
        number: cardDetails.number,
        expiry: cardDetails.expiry,
        cvv: cardDetails.cvv
      }
    };

    // ARCHITECTURE VIOLATION: Direct API call without resilience patterns
    const response = await axios.post('https://payment-gateway-api.com/process', paymentData, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  // ARCHITECTURE VIOLATION: Direct webhook handling without abstraction
  async handlePaymentWebhook(webhookData: any): Promise<void> {
    const { orderId, status, transactionId } = webhookData;

    // ARCHITECTURE VIOLATION: Direct database update in integration layer
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
      await client.query(
        'UPDATE orders SET payment_status = $1, transaction_id = $2 WHERE order_id = $3',
        [status, transactionId, orderId]
      );
    } finally {
      await client.end();
    }
  }
}

export class EmailNotificationIntegration {
  // ARCHITECTURE VIOLATION: Direct email service integration
  async sendOrderConfirmation(orderId: number, customerEmail: string, orderDetails: any): Promise<void> {
    const nodemailer = require('nodemailer');

    // ARCHITECTURE VIOLATION: Email template logic in integration layer
    const emailHtml = `
      <h1>Order Confirmation #${orderId}</h1>
      <p>Thank you for your order!</p>
      <ul>
        ${orderDetails.items.map((item: any) =>
          `<li>${item.name} - $${item.price}</li>`
        ).join('')}
      </ul>
      <p>Total: $${orderDetails.total}</p>
    `;

    // ARCHITECTURE VIOLATION: Direct SMTP configuration
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: emailHtml
    });
  }

  // ARCHITECTURE VIOLATION: Direct bulk email handling
  async sendBulkNotifications(orders: any[]): Promise<void> {
    for (const order of orders) {
      // ARCHITECTURE VIOLATION: No rate limiting or batching
      await this.sendOrderConfirmation(order.id, order.customerEmail, order);
      // ARCHITECTURE VIOLATION: No error handling for individual failures
    }
  }
}

export class InventoryManagementIntegration {
  // ARCHITECTURE VIOLATION: Direct inventory system integration
  async checkProductAvailability(productId: string): Promise<boolean> {
    const axios = require('axios');

    try {
      // ARCHITECTURE VIOLATION: Direct API call without abstraction
      const response = await axios.get(`https://inventory-api.com/products/${productId}/availability`);
      return response.data.available;
    } catch (error) {
      // ARCHITECTURE VIOLATION: Silent failure
      return false;
    }
  }

  // ARCHITECTURE VIOLATION: Direct inventory updates
  async updateProductStock(productId: string, quantityChange: number): Promise<void> {
    const axios = require('axios');

    // ARCHITECTURE VIOLATION: Direct API call in utility
    await axios.patch(`https://inventory-api.com/products/${productId}/stock`, {
      quantityChange
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.INVENTORY_API_KEY}`
      }
    });
  }

  // ARCHITECTURE VIOLATION: Direct bulk inventory operations
  async syncInventoryWithExternalSystem(): Promise<void> {
    // ARCHITECTURE VIOLATION: Direct database queries in integration layer
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
      const products = await client.query('SELECT product_id, current_stock FROM products');

      // ARCHITECTURE VIOLATION: Direct external API calls in loop
      for (const product of products.rows) {
        const externalStock = await this.getExternalStockLevel(product.product_id);

        if (externalStock !== product.current_stock) {
          // ARCHITECTURE VIOLATION: Direct database updates
          await client.query(
            'UPDATE products SET current_stock = $1 WHERE product_id = $2',
            [externalStock, product.product_id]
          );
        }
      }
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: Direct external API calls
  private async getExternalStockLevel(productId: string): Promise<number> {
    const axios = require('axios');

    const response = await axios.get(`https://external-inventory.com/stock/${productId}`);
    return response.data.stockLevel;
  }
}

export class ShippingServiceIntegration {
  // ARCHITECTURE VIOLATION: Direct shipping provider integration
  async createShippingLabel(orderId: number, shippingAddress: any): Promise<any> {
    const axios = require('axios');

    // ARCHITECTURE VIOLATION: Direct API integration without abstraction
    const response = await axios.post('https://shipping-provider.com/labels', {
      orderId,
      address: shippingAddress,
      service: 'standard'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SHIPPING_API_KEY}`
      }
    });

    // ARCHITECTURE VIOLATION: Direct database storage of external data
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
      await client.query(
        'INSERT INTO shipping_labels (order_id, tracking_number, label_url) VALUES ($1, $2, $3)',
        [orderId, response.data.trackingNumber, response.data.labelUrl]
      );

      return response.data;
    } finally {
      await client.end();
    }
  }

  // ARCHITECTURE VIOLATION: Direct tracking information retrieval
  async getTrackingInfo(trackingNumber: string): Promise<any> {
    const axios = require('axios');

    // ARCHITECTURE VIOLATION: Direct external API call
    const response = await axios.get(`https://shipping-provider.com/track/${trackingNumber}`);

    return response.data;
  }
}

// ARCHITECTURE VIOLATION: God utility class handling multiple external systems
export class ExternalSystemsCoordinator {
  // ARCHITECTURE VIOLATION: Direct instantiation of multiple external services
  private paymentGateway = new PaymentGatewayIntegration();
  private emailService = new EmailNotificationIntegration();
  private inventoryService = new InventoryManagementIntegration();
  private shippingService = new ShippingServiceIntegration();

  // ARCHITECTURE VIOLATION: Single method orchestrating multiple external systems
  async processOrderFulfillment(orderId: number, orderData: any): Promise<any> {
    // Step 1: Check inventory (direct call)
    for (const item of orderData.items) {
      const available = await this.inventoryService.checkProductAvailability(item.productId);
      if (!available) {
        throw new Error(`Product ${item.productId} not available`);
      }
    }

    // Step 2: Process payment (direct call)
    const paymentResult = await this.paymentGateway.processPayment(
      orderId.toString(),
      orderData.total,
      orderData.payment.card
    );

    // Step 3: Update inventory (direct call)
    for (const item of orderData.items) {
      await this.inventoryService.updateProductStock(item.productId, -item.quantity);
    }

    // Step 4: Create shipping label (direct call)
    const shippingLabel = await this.shippingService.createShippingLabel(
      orderId,
      orderData.shippingAddress
    );

    // Step 5: Send confirmation email (direct call)
    await this.emailService.sendOrderConfirmation(
      orderId,
      orderData.customerEmail,
      orderData
    );

    return {
      payment: paymentResult,
      shipping: shippingLabel,
      status: 'fulfilled'
    };
  }

  // ARCHITECTURE VIOLATION: Direct external system health checks
  async checkSystemHealth(): Promise<any> {
    const axios = require('axios');

    // ARCHITECTURE VIOLATION: Direct health check calls to multiple external systems
    const [paymentHealth, inventoryHealth, shippingHealth] = await Promise.all([
      axios.get('https://payment-gateway-api.com/health'),
      axios.get('https://inventory-api.com/health'),
      axios.get('https://shipping-provider.com/health')
    ]);

    return {
      payment: paymentHealth.data.status,
      inventory: inventoryHealth.data.status,
      shipping: shippingHealth.data.status,
      overall: 'healthy' // ARCHITECTURE VIOLATION: No real health aggregation
    };
  }
}
