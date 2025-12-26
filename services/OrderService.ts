// PR #12 - HIGH-VOLUME TRANSACTION PROCESSING: Scalability and performance optimization
// This PR demonstrates enterprise-scale transaction processing with performance SLAs

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  category: string;
  inventoryId: string;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  tax: number;
  shipping: number;
  createdAt: Date;
  processedAt?: Date;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

// PERFORMANCE: O(n²) complexity - nested loops processing orders
export class OrderProcessingService {
  // HIGH VOLUME: Process thousands of orders per minute
  async processBulkOrders(orders: Order[]): Promise<Order[]> {
    const processedOrders: Order[] = [];

    // PERFORMANCE: Nested loops - O(n²) complexity
    for (const order of orders) {
      // PERFORMANCE: Multiple database calls in loop
      const validatedOrder = await this.validateOrder(order);

      if (validatedOrder) {
        // PERFORMANCE: Synchronous processing of each order
        const processed = await this.processSingleOrder(validatedOrder);

        // PERFORMANCE: Inventory check for each item individually
        for (const item of processed.items) {
          await this.checkInventory(item); // Database call per item
          await this.reserveInventory(item); // Another database call
        }

        // PERFORMANCE: Tax calculation for each order separately
        processed.tax = await this.calculateTax(processed);
        processed.shipping = await this.calculateShipping(processed);

        processedOrders.push(processed);
      }
    }

    return processedOrders;
  }

  // PERFORMANCE: Memory allocation in loops
  async processHighVolumeOrders(orders: Order[]): Promise<void> {
    // PERFORMANCE: Creating large arrays in memory
    const orderIds: string[] = [];
    const userIds: number[] = [];
    const productIds: string[] = [];

    // PERFORMANCE: Multiple array allocations and pushes
    for (const order of orders) {
      orderIds.push(order.id);
      userIds.push(order.userId);

      for (const item of order.items) {
        productIds.push(item.productId);
      }
    }

    // PERFORMANCE: Inefficient data structures
    const orderMap = new Map(); // Could use more efficient structure
    const productCount = new Map<string, number>();

    // PERFORMANCE: Nested loops with O(n*m) complexity
    for (const order of orders) {
      orderMap.set(order.id, order);

      for (const item of order.items) {
        const current = productCount.get(item.productId) || 0;
        productCount.set(item.productId, current + item.quantity);
      }
    }

    // PERFORMANCE: Blocking operations in async function
    await this.updateInventoryLevels(productCount); // Synchronous database update
    await this.sendOrderConfirmations(orderIds); // Synchronous email sending
  }

  // PERFORMANCE: Inefficient grouping algorithm
  async generateSalesReport(startDate: Date, endDate: Date): Promise<any> {
    // PERFORMANCE: Fetch all orders at once (could be millions)
    const allOrders = await this.getAllOrdersInDateRange(startDate, endDate);

    // PERFORMANCE: Manual grouping with O(n²) operations
    const salesByCategory: { [category: string]: { total: number; count: number } } = {};

    for (const order of allOrders) {
      for (const item of order.items) {
        if (!salesByCategory[item.category]) {
          salesByCategory[item.category] = { total: 0, count: 0 };
        }

        salesByCategory[item.category].total += item.price * item.quantity;
        salesByCategory[item.category].count += 1;
      }
    }

    return salesByCategory;
  }

  // PERFORMANCE: Synchronous file operations in async context
  async exportOrdersToCSV(orders: Order[]): Promise<string> {
    const fs = require('fs');
    const path = require('path');

    const fileName = `orders_export_${Date.now()}.csv`;
    const filePath = path.join(process.cwd(), 'exports', fileName);

    // PERFORMANCE: Synchronous file write in async function
    let csvContent = 'Order ID,User ID,Total,Status,Created At\n';

    for (const order of orders) {
      csvContent += `${order.id},${order.userId},${order.total},${order.status},${order.createdAt.toISOString()}\n`;
    }

    // PERFORMANCE: Blocking file I/O
    fs.writeFileSync(filePath, csvContent);

    return filePath;
  }

  // PERFORMANCE: Recursive function without tail optimization
  async processOrderHierarchy(orderId: string, depth: number = 0): Promise<Order[]> {
    if (depth > 10) {
      throw new Error('Order hierarchy too deep');
    }

    const order = await this.getOrderById(orderId);
    const childOrders: Order[] = [];

    // PERFORMANCE: Recursive database calls
    for (const item of order.items) {
      if (item.category === 'bundle') {
        const subOrders = await this.processOrderHierarchy(item.productId, depth + 1);
        childOrders.push(...subOrders);
      }
    }

    return [order, ...childOrders];
  }

  private async validateOrder(order: Order): Promise<Order | null> {
    // Multiple validation checks
    const userExists = await this.checkUserExists(order.userId);
    const itemsValid = await this.validateOrderItems(order.items);
    const paymentValid = await this.validatePayment(order.userId, order.total);

    return (userExists && itemsValid && paymentValid) ? order : null;
  }

  private async processSingleOrder(order: Order): Promise<Order> {
    order.status = 'processing';
    order.processedAt = new Date();
    return order;
  }

  private async checkInventory(item: OrderItem): Promise<boolean> {
    // Database call to check inventory
    return true;
  }

  private async reserveInventory(item: OrderItem): Promise<void> {
    // Database call to reserve inventory
    console.log(`Reserved inventory for ${item.productId}`);
  }

  private async calculateTax(order: Order): Promise<number> {
    // Complex tax calculation
    return order.total * 0.08; // 8% tax
  }

  private async calculateShipping(order: Order): Promise<number> {
    // Shipping calculation based on weight, distance, etc.
    return 9.99;
  }

  private async getAllOrdersInDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    // Simulate fetching orders (could be millions)
    return [];
  }

  private async updateInventoryLevels(productCount: Map<string, number>): Promise<void> {
    // Batch update inventory levels
    for (const [productId, count] of productCount) {
      console.log(`Updated inventory for ${productId}: -${count}`);
    }
  }

  private async sendOrderConfirmations(orderIds: string[]): Promise<void> {
    // Send confirmation emails
    for (const orderId of orderIds) {
      console.log(`Sent confirmation for order ${orderId}`);
    }
  }

  private async getOrderById(orderId: string): Promise<Order> {
    // Database query
    return {} as Order;
  }

  private async checkUserExists(userId: number): Promise<boolean> {
    return true;
  }

  private async validateOrderItems(items: OrderItem[]): Promise<boolean> {
    return true;
  }

  private async validatePayment(userId: number, amount: number): Promise<boolean> {
    return true;
  }
}