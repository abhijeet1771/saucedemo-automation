// DUPLICATE CODE: Similar to TestDataHelper.generateUserData()
export class DataGenerator {
  static generate(count: number) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        username: `user${i}`,
        email: `user${i}@test.com`,
        password: `password${i}`
      });
    }
    return users;
  }

  // PERFORMANCE: Unnecessary object creation
  static createProductList(names: string[]) {
    const products = [];
    for (const name of names) {
      // Creates new object for each iteration
      const product = {
        id: Math.random(),
        name: name,
        price: Math.random() * 100,
        category: 'default',
        stock: 0
      };
      products.push(product);
    }
    return products;
  }

  // CACHING OPPORTUNITY: Recalculates same values
  static calculateTotal(items: any[]) {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    // Should cache if items haven't changed
    return total;
  }
}

