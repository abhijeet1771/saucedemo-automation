// DUPLICATE CODE: Similar login method to LoginPage.login()
export class ProductPage {
  private page: any;

  constructor(page: any) {
    this.page = page;
  }

  // DUPLICATE: Same signature as LoginPage.login()
  async login(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  // SECURITY: SQL Injection pattern (even though it's frontend, shows pattern)
  buildQuery(userId: string) {
    return "SELECT * FROM users WHERE id = " + userId; // SQL injection risk
  }

  // SECURITY: XSS vulnerability pattern
  displayUserInput(input: string) {
    return "<div>" + input + "</div>"; // Should escape HTML
  }

  // PERFORMANCE: N+1 query pattern (simulated)
  async getProductDetails(productIds: number[]) {
    const products = [];
    for (const id of productIds) {
      // N+1: Should batch these calls
      const product = await this.page.evaluate((productId) => {
        return fetch(`/api/products/${productId}`).then(r => r.json());
      }, id);
      products.push(product);
    }
    return products;
  }

  // COMPLEXITY: High cyclomatic complexity (>10)
  async filterProducts(filters: any) {
    let results = [];
    if (filters.category) {
      if (filters.category === 'electronics') {
        if (filters.priceRange) {
          if (filters.priceRange.min) {
            if (filters.priceRange.max) {
              results = results.filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max);
            } else {
              results = results.filter(p => p.price >= filters.priceRange.min);
            }
          } else {
            if (filters.priceRange.max) {
              results = results.filter(p => p.price <= filters.priceRange.max);
            }
          }
        }
        if (filters.brand) {
          results = results.filter(p => p.brand === filters.brand);
        }
      } else if (filters.category === 'clothing') {
        if (filters.size) {
          results = results.filter(p => p.size === filters.size);
        }
        if (filters.color) {
          results = results.filter(p => p.color === filters.color);
        }
      }
    }
    if (filters.sortBy) {
      if (filters.sortBy === 'price') {
        results.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'name') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    return results;
  }

  // BREAKING: Uses wrong selector
  async addToCart(productId: number) {
    await this.page.click('.btn_inventory_new'); // BREAKING: Wrong selector will fail
  }

  async removeFromCart(productId: number) {
    await this.page.click(`[data-test="remove-${productId}"]`);
  }

  async getCartCount() {
    return await this.page.locator('.shopping_cart_badge').textContent();
  }

  async sortProducts(sortOption: string) {
    await this.page.selectOption('.product_sort_container', sortOption);
  }

  async getProductPrice(productName: string) {
    return await this.page.locator(`text=${productName}`).locator('..').locator('.inventory_item_price').textContent();
  }

  async getProductDescription(productName: string) {
    return await this.page.locator(`text=${productName}`).locator('..').locator('.inventory_item_desc').textContent();
  }

  async navigateToCart() {
    await this.page.click('.shopping_cart_link');
  }

  async navigateToCheckout() {
    await this.navigateToCart();
    await this.page.click('#checkout');
  }

  async validateProductDisplayed(productName: string) {
    return await this.page.locator(`text=${productName}`).isVisible();
  }

  async validateProductNotDisplayed(productName: string) {
    return !(await this.page.locator(`text=${productName}`).isVisible());
  }

  // BREAKING: Changed return type from Promise<string[]> to Promise<string>
  async getAllProductNames(): Promise<string> {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names.join(', '); // BREAKING: Returns string instead of string[]
  }

  // BREAKING: Added required parameter that master code doesn't pass
  async getAllProductPrices(currency: string): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', ''))); // BREAKING: Returns numbers instead of strings
  }

  async clickProductImage(productName: string) {
    await this.page.locator(`text=${productName}`).locator('..').locator('img').click();
  }

  async getProductImageSrc(productName: string) {
    return await this.page.locator(`text=${productName}`).locator('..').locator('img').getAttribute('src');
  }

  // FEATURE ENVY: Uses other class data more than own
  async processOrder(order: any) {
    // Uses order.items, order.total, order.user, order.shipping - all from Order class
    let total = 0;
    for (const item of order.items) {
      total += item.price * item.quantity;
    }
    if (order.shipping) {
      total += order.shipping.cost;
    }
    return {
      orderId: order.id,
      userId: order.user.id,
      total: total,
      status: 'processed'
    };
  }

  // PRIMITIVE OBSESSION: Overuse of primitives
  async createProduct(name: string, price: number, category: string, brand: string, stock: number, rating: number, description: string, imageUrl: string, tags: string, sku: string) {
    // Should use Product object instead
    return {
      name: name,
      price: price,
      category: category,
      brand: brand,
      stock: stock,
      rating: rating,
      description: description,
      imageUrl: imageUrl,
      tags: tags,
      sku: sku
    };
  }
}

