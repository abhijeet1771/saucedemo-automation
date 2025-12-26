// FRAMEWORK VIOLATION: Page Object Model with anti-patterns and framework violations
// FRAMEWORK VIOLATION: Stale element references, improper abstractions, locator issues

export class ProductPage {
  // FRAMEWORK VIOLATION: Direct page reference instead of proper POM pattern
  private page: any;

  // FRAMEWORK VIOLATION: Static locators that may become stale
  private static readonly PRODUCT_LIST = '.inventory_list';
  private static readonly PRODUCT_ITEM = '.inventory_item';
  private static readonly ADD_TO_CART_BUTTON = '.btn_inventory';
  private static readonly PRODUCT_NAME = '.inventory_item_name';
  private static readonly PRODUCT_PRICE = '.inventory_item_price';

  constructor(page: any) {
    this.page = page;
  }

  // FRAMEWORK VIOLATION: Method doing multiple things (violation of Single Responsibility)
  async addFirstProductToCart(): Promise<void> {
    // FRAMEWORK VIOLATION: No element existence check
    await this.page.click('.inventory_item:first-child .btn_inventory');

    // FRAMEWORK VIOLATION: No wait for state change
    // FRAMEWORK VIOLATION: No verification that product was added
  }

  // FRAMEWORK VIOLATION: Method with side effects and poor naming
  async addProductByIndex(index: number): Promise<void> {
    // FRAMEWORK VIOLATION: String concatenation for selectors (brittle)
    const selector = `.inventory_item:nth-child(${index + 1}) .btn_inventory`;

    // FRAMEWORK VIOLATION: Direct click without stability checks
    await this.page.click(selector);

    // FRAMEWORK VIOLATION: Side effect - updates cart badge
    await this.updateCartBadge();
  }

  // FRAMEWORK VIOLATION: Private method with external dependencies
  private async updateCartBadge(): Promise<void> {
    // FRAMEWORK VIOLATION: Direct DOM manipulation in POM
    await this.page.evaluate(() => {
      const badge = document.querySelector('.shopping_cart_badge');
      if (badge) {
        const currentCount = parseInt(badge.textContent || '0');
        badge.textContent = (currentCount + 1).toString();
      }
    });
  }

  // FRAMEWORK VIOLATION: Method returning DOM elements instead of data
  async getProductElements(): Promise<any[]> {
    // FRAMEWORK VIOLATION: Returning raw Playwright elements (tight coupling)
    return await this.page.locator('.inventory_item').all();
  }

  // FRAMEWORK VIOLATION: Method with complex logic and multiple responsibilities
  async addMultipleProducts(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      // FRAMEWORK VIOLATION: Inefficient selector strategy (text-based)
      const productLocator = this.page.locator('.inventory_item').filter({
        hasText: productName
      });

      // FRAMEWORK VIOLATION: No check if product exists
      await productLocator.locator('.btn_inventory').click();

      // FRAMEWORK VIOLATION: Hardcoded delay (flaky)
      await this.page.waitForTimeout(500);
    }
  }

  // FRAMEWORK VIOLATION: Method with external API calls (infrastructure in UI layer)
  async loadProductDataFromAPI(): Promise<void> {
    // FRAMEWORK VIOLATION: HTTP calls in page object
    const response = await this.page.request.get('/api/products');

    if (response.ok()) {
      const products = await response.json();

      // FRAMEWORK VIOLATION: Direct DOM manipulation
      await this.page.evaluate((productData: any[]) => {
        const container = document.querySelector('.inventory_list');
        if (container) {
          container.innerHTML = productData.map(product =>
            `<div class="inventory_item">
              <div class="inventory_item_name">${product.name}</div>
              <div class="inventory_item_price">$${product.price}</div>
              <button class="btn_inventory" data-product-id="${product.id}">Add to Cart</button>
            </div>`
          ).join('');
        }
      }, products);
    }
  }

  // FRAMEWORK VIOLATION: Method with complex conditional logic
  async sortProducts(sortBy: string): Promise<void> {
    // FRAMEWORK VIOLATION: Complex selector for sort dropdown
    const sortDropdown = this.page.locator('[data-test="product_sort_container"] select');

    // FRAMEWORK VIOLATION: Complex conditional logic in POM
    if (sortBy === 'name') {
      await sortDropdown.selectOption('az');
    } else if (sortBy === 'name-reverse') {
      await sortDropdown.selectOption('za');
    } else if (sortBy === 'price-low') {
      await sortDropdown.selectOption('lohi');
    } else if (sortBy === 'price-high') {
      await sortDropdown.selectOption('hilo');
    } else {
      throw new Error(`Unknown sort option: ${sortBy}`);
    }

    // FRAMEWORK VIOLATION: No wait for sort completion
    await this.page.waitForTimeout(1000);
  }

  // FRAMEWORK VIOLATION: Method returning implementation details
  async getAddToCartButtons(): Promise<any[]> {
    // FRAMEWORK VIOLATION: Exposing Playwright locators (implementation leakage)
    const buttons = await this.page.locator('.btn_inventory').all();
    return buttons;
  }

  // FRAMEWORK VIOLATION: Method with side effects and unclear responsibilities
  async clickRandomProduct(): Promise<string> {
    // FRAMEWORK VIOLATION: Random behavior in tests (non-deterministic)
    const products = await this.page.locator('.inventory_item').all();
    const randomIndex = Math.floor(Math.random() * products.length);

    // FRAMEWORK VIOLATION: Direct array access without bounds checking
    const randomProduct = products[randomIndex];
    const productName = await randomProduct.locator('.inventory_item_name').textContent();

    // FRAMEWORK VIOLATION: Side effect - actually clicks the product
    await randomProduct.click();

    // FRAMEWORK VIOLATION: Returns product name (unclear responsibility)
    return productName || 'Unknown Product';
  }

  // FRAMEWORK VIOLATION: Static method with global state
  private static productCache: Map<string, any> = new Map();

  static async getCachedProductInfo(productId: string, page: any): Promise<any> {
    // FRAMEWORK VIOLATION: Static method with page dependency (bad design)
    if (this.productCache.has(productId)) {
      return this.productCache.get(productId);
    }

    // FRAMEWORK VIOLATION: Direct API call in static method
    const response = await page.request.get(`/api/products/${productId}`);
    const productInfo = await response.json();

    this.productCache.set(productId, productInfo);
    return productInfo;
  }

  // FRAMEWORK VIOLATION: Method with excessive parameters
  async filterProducts(nameFilter: string, priceMin: number, priceMax: number,
                      categoryFilter: string, inStockOnly: boolean,
                      sortOrder: string, pageSize: number): Promise<void> {

    // FRAMEWORK VIOLATION: Complex parameter list (primitive obsession)
    // FRAMEWORK VIOLATION: Single method doing too many things

    // Apply filters one by one (inefficient)
    if (nameFilter) {
      await this.page.fill('[data-test="search-input"]', nameFilter);
    }

    if (priceMin > 0) {
      await this.page.fill('[data-test="price-min"]', priceMin.toString());
    }

    if (priceMax > 0) {
      await this.page.fill('[data-test="price-max"]', priceMax.toString());
    }

    if (categoryFilter) {
      await this.page.selectOption('[data-test="category-select"]', categoryFilter);
    }

    if (inStockOnly) {
      await this.page.check('[data-test="in-stock-only"]');
    }

    if (sortOrder) {
      await this.sortProducts(sortOrder);
    }

    // FRAMEWORK VIOLATION: No validation of parameters
    // FRAMEWORK VIOLATION: No error handling
    // FRAMEWORK VIOLATION: No wait for filter application
  }

  // FRAMEWORK VIOLATION: Method with tight coupling to test framework
  async waitForProductLoad(timeout: number = 5000): Promise<void> {
    // FRAMEWORK VIOLATION: Hardcoded timeout
    // FRAMEWORK VIOLATION: No retry logic
    // FRAMEWORK VIOLATION: Generic wait without specific conditions

    await this.page.waitForSelector('.inventory_item', { timeout });

    // FRAMEWORK VIOLATION: Additional arbitrary wait
    await this.page.waitForTimeout(1000);
  }

  // FRAMEWORK VIOLATION: Method exposing internal state
  getPageInstance(): any {
    // FRAMEWORK VIOLATION: Exposing page instance (breaks encapsulation)
    return this.page;
  }

  // FRAMEWORK VIOLATION: Method with mixed concerns (UI + business logic)
  async addToCartWithValidation(productName: string): Promise<boolean> {
    try {
      // UI concern
      const productCard = this.page.locator('.inventory_item').filter({
        hasText: productName
      });

      // FRAMEWORK VIOLATION: Business logic in POM (checking stock)
      const stockStatus = await productCard.locator('.stock-status').textContent();
      if (stockStatus === 'Out of Stock') {
        return false;
      }

      // UI concern
      await productCard.locator('.btn_inventory').click();

      // FRAMEWORK VIOLATION: Business logic in POM (cart validation)
      const cartBadge = await this.page.locator('.shopping_cart_badge').textContent();
      const cartCount = parseInt(cartBadge || '0');

      return cartCount > 0;
    } catch (error) {
      // FRAMEWORK VIOLATION: Silent failure
      console.log(`Failed to add ${productName} to cart:`, error);
      return false;
    }
  }
}

// FRAMEWORK VIOLATION: Factory with anti-patterns
export class ProductPageFactory {
  // FRAMEWORK VIOLATION: Factory with global state
  private static instances: Map<string, ProductPage> = new Map();

  // FRAMEWORK VIOLATION: Singleton-like factory
  static getProductPage(page: any, context: string = 'default'): ProductPage {
    const key = `${context}-${page.url()}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new ProductPage(page));
    }

    return this.instances.get(key)!;
  }

  // FRAMEWORK VIOLATION: Factory doing configuration
  static createConfiguredProductPage(page: any, config: any): ProductPage {
    const productPage = new ProductPage(page);

    // FRAMEWORK VIOLATION: Factory modifying created objects
    if (config.enableCache) {
      // Direct object manipulation
      (productPage as any).cacheEnabled = true;
    }

    if (config.defaultTimeout) {
      (productPage as any).defaultTimeout = config.defaultTimeout;
    }

    return productPage;
  }
}