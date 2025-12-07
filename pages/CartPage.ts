// DUPLICATE CODE: Similar methods to ProductPage
export class CartPage {
  private page: any;

  constructor(page: any) {
    this.page = page;
  }

  // DUPLICATE: Same as ProductPage.getCartCount()
  async getCartCount() {
    return await this.page.locator('.shopping_cart_badge').textContent();
  }

  // DUPLICATE: Same as ProductPage.navigateToCart()
  async navigateToCart() {
    await this.page.click('.shopping_cart_link');
  }

  // PERFORMANCE: Inefficient array operations
  async getAllCartItems() {
    const items = [];
    const itemElements = await this.page.locator('.cart_item').all();
    for (let i = 0; i < itemElements.length; i++) {
      // Should use map() instead
      const name = await itemElements[i].locator('.inventory_item_name').textContent();
      const price = await itemElements[i].locator('.inventory_item_price').textContent();
      items.push({ name, price });
    }
    return items;
  }

  // MEMORY LEAK: Unclosed resources (simulated)
  async processCartItems() {
    const items = await this.getAllCartItems();
    const processors = [];
    for (const item of items) {
      // Creates processor but never closes it
      const processor = new ItemProcessor(item);
      processors.push(processor);
      processor.process();
    }
    // Should close all processors
    return processors;
  }

  // DEAD CODE: Unused method
  async unusedMethod() {
    const x = 10;
    const y = 20;
    return x + y;
  }

  // OFF-BY-ONE ERROR
  async getItemByIndex(index: number) {
    const items = await this.page.locator('.cart_item').all();
    return items[index]; // Should check bounds: if (index >= items.length) throw
  }

  // LOGIC BUG: Missing validation
  async removeItem(itemName: string) {
    // Should validate itemName is not empty
    await this.page.locator(`text=${itemName}`).locator('..').locator('button').click();
  }

  // MISSING ERROR HANDLING
  async checkout() {
    await this.page.click('#checkout');
    // Should wait for navigation and handle errors
  }
}

// Helper class for memory leak example
class ItemProcessor {
  private item: any;
  private resource: any;

  constructor(item: any) {
    this.item = item;
    this.resource = new Resource(); // Should be closed
  }

  process() {
    // Process item
  }

  // Missing close() method
}

class Resource {
  // Simulated resource that should be closed
}

