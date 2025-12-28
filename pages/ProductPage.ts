// BREAKING: Complete redesign with new imports and architecture
import { Product, Money, Category, InventoryStatus, ProductAttributes, Order, CartItem, AppError, NotFoundError } from '../types/CoreTypes';

interface ProductPageConfig {
  baseUrl: string;
  timeout: number;
  currency: string;
  locale: string;
}

interface ProductFilter {
  category?: string;
  priceRange?: { min?: number; max?: number };
  brand?: string;
  inStock?: boolean;
}

interface ProductSort {
  by: 'name' | 'price' | 'rating';
  order: 'asc' | 'desc';
}

// BREAKING: Constructor now requires configuration
export class ProductPage {
  private page: any;
  private config: ProductPageConfig;

  constructor(page: any, config: ProductPageConfig) {
    this.page = page;
    this.config = config;
  }

  // BREAKING: login method removed - use LoginPage instead
  // Login functionality moved to LoginPage

  // BREAKING: Methods removed - security risks eliminated

  // BREAKING: getProductDetails now uses Product type and proper error handling
  async getProductDetails(productSkus: string[]): Promise<Product[]> {
    if (!Array.isArray(productSkus) || productSkus.length === 0) {
      throw new ValidationError('productSkus', 'Product SKUs array is required');
    }

    // BREAKING: Batch API call instead of N+1
    const response = await this.page.evaluate(async (skus) => {
      const results = await Promise.allSettled(
        skus.map(sku => fetch(`/api/products/${sku}`).then(r => r.json()))
      );

      return results.map((result, index) => ({
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
        sku: skus[index]
      }));
    }, productSkus);

    const products: Product[] = [];
    const errors: string[] = [];

    for (const item of response) {
      if (item.success && item.data) {
        products.push(this.mapApiResponseToProduct(item.data));
      } else {
        errors.push(`Failed to load product ${{}}: ${{}}`, item.sku, item.error);
      }
    }

    if (errors.length > 0) {
      console.warn('Product loading warnings:', errors);
    }

    return products;
  }

  // BREAKING: New private method for data mapping
  private mapApiResponseToProduct(apiData: any): Product {
    return {
      sku: apiData.sku,
      name: apiData.name,
      price: {
        amount: apiData.price,
        currency: this.config.currency,
        formatted: new Intl.NumberFormat(this.config.locale, {
          style: 'currency',
          currency: this.config.currency
        }).format(apiData.price)
      },
      category: {
        id: apiData.categoryId,
        name: apiData.categoryName,
        metadata: apiData.categoryMetadata || {}
      },
      inventory: {
        available: apiData.stock,
        reserved: apiData.reserved || 0,
        total: apiData.totalStock || apiData.stock,
        status: this.calculateInventoryStatus(apiData.stock, apiData.totalStock)
      },
      attributes: {
        brand: apiData.brand,
        model: apiData.model,
        specifications: apiData.specifications || {},
        tags: apiData.tags || []
      }
    };
  }

  // BREAKING: New private method for inventory status
  private calculateInventoryStatus(available: number, total?: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (available <= 0) return 'out_of_stock';
    if (available <= 5) return 'low_stock'; // Magic number - should be configurable
    return 'in_stock';
  }

  // BREAKING: Completely redesigned with proper typing and separation of concerns
  async filterProducts(filters: ProductFilter): Promise<Product[]> {
    // BREAKING: Get all products first (simulated)
    const allProducts = await this.getAllProducts();

    let filteredProducts = [...allProducts];

    // BREAKING: Apply filters using proper methods
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.name.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price.amount;
        const min = filters.priceRange!.min;
        const max = filters.priceRange!.max;

        if (min !== undefined && price < min) return false;
        if (max !== undefined && price > max) return false;
        return true;
      });
    }

    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product =>
        product.attributes.brand.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        filters.inStock ? product.inventory.status === 'in_stock' : true
      );
    }

    return filteredProducts;
  }

  // BREAKING: New method to sort products
  async sortProducts(products: Product[], sortOptions: ProductSort): Promise<Product[]> {
    const sorted = [...products];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.by) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price.amount - b.price.amount;
          break;
        case 'rating':
          // Assuming rating is in attributes
          const ratingA = a.attributes.specifications?.rating || 0;
          const ratingB = b.attributes.specifications?.rating || 0;
          comparison = ratingA - ratingB;
          break;
      }

      return sortOptions.order === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  // BREAKING: New method to get all products
  private async getAllProducts(): Promise<Product[]> {
    // Simulate getting products from page or API
    const productsData = await this.page.$$eval('.inventory_item', (items) =>
      items.map(item => ({
        sku: item.querySelector('[data-test*="saucelabs"]').textContent,
        name: item.querySelector('.inventory_item_name').textContent,
        price: parseFloat(item.querySelector('.inventory_item_price').textContent.replace('$', '')),
        category: { id: 'general', name: 'General', metadata: {} },
        inventory: { available: 10, reserved: 0, total: 10, status: 'in_stock' },
        attributes: {
          brand: 'Sauce Labs',
          model: 'Test Product',
          specifications: {},
          tags: []
        }
      }))
    );

    return productsData.map(data => this.mapApiResponseToProduct(data));
  }

  // BREAKING: Cart methods now use SKU instead of ID and return CartItem objects
  async addToCart(productSku: string): Promise<CartItem> {
    await this.page.click(`[data-test="add-to-cart-${productSku}"]`);

    // BREAKING: Return cart item instead of void
    const product = await this.getProductBySku(productSku);
    return {
      product,
      quantity: 1,
      addedAt: new Date(),
      metadata: {}
    };
  }

  async removeFromCart(productSku: string): Promise<void> {
    await this.page.click(`[data-test="remove-${productSku}"]`);
  }

  async getCartCount(): Promise<number> {
    const badgeText = await this.page.locator('.shopping_cart_badge').textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }

  // BREAKING: sortProducts now uses ProductSort interface
  async sortProducts(sortOptions: ProductSort): Promise<void> {
    let sortValue: string;
    switch (sortOptions.by) {
      case 'name':
        sortValue = sortOptions.order === 'asc' ? 'az' : 'za';
        break;
      case 'price':
        sortValue = sortOptions.order === 'asc' ? 'lohi' : 'hilo';
        break;
      default:
        sortValue = 'az';
    }

    await this.page.selectOption('.product_sort_container', sortValue);
  }

  // BREAKING: getProductPrice now returns Money object
  async getProductPrice(productName: string): Promise<Money> {
    const priceText = await this.page.locator(`text=${productName}`).locator('..').locator('.inventory_item_price').textContent();
    const amount = parseFloat(priceText.replace('$', ''));

    return {
      amount,
      currency: this.config.currency,
      formatted: priceText
    };
  }

  async getProductDescription(productName: string): Promise<string> {
    return await this.page.locator(`text=${productName}`).locator('..').locator('.inventory_item_desc').textContent();
  }

  async navigateToCart(): Promise<void> {
    await this.page.click('.shopping_cart_link');
    await this.page.waitForURL('**/cart.html');
  }

  async navigateToCheckout(): Promise<void> {
    await this.navigateToCart();
    await this.page.click('[data-test="checkout"]');
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  // BREAKING: New method required
  private async getProductBySku(sku: string): Promise<Product> {
    // Find product by SKU from current page
    const products = await this.getAllProducts();
    const product = products.find(p => p.sku === sku);

    if (!product) {
      throw new NotFoundError('Product', sku);
    }

    return product;
  }

  async validateProductDisplayed(productName: string) {
    return await this.page.locator(`text=${productName}`).isVisible();
  }

  async validateProductNotDisplayed(productName: string) {
    return !(await this.page.locator(`text=${productName}`).isVisible());
  }

  async getAllProductNames() {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getAllProductPrices() {
    return await this.page.locator('.inventory_item_price').allTextContents();
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

