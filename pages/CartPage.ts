// DUPLICATE CODE: Similar methods to ProductPage
export class CartPage {
  private page: any;

  constructor(page: any) {
    this.page = page;
  }

  // LOCATOR ISSUE: Good locator (should be kept)
  async getCartCount() {
    return await this.page.locator('.shopping_cart_badge').textContent();
  }

  // LOCATOR ISSUE: Brittle XPath locator (ARCHON should flag this)
  async navigateToCart() {
    // BAD: Brittle XPath - position-based, will break if DOM changes
    await this.page.locator('//div[@class="shopping_cart_container"]/a').click();
  }

  // LOCATOR ISSUE: Complex CSS selector (ARCHON should suggest optimization)
  async getCartItemByName(name: string) {
    // BAD: Overly complex selector chain
    return await this.page.locator(`.cart_item:has(.inventory_item_name:has-text("${name}")) .inventory_item_price`);
  }

  // LOCATOR ISSUE: Dynamic ID locator (unstable)
  async removeItemByDynamicId(itemId: string) {
    // BAD: Dynamic IDs change on every page load
    await this.page.locator(`#item-${itemId}-remove-btn`).click();
  }

  // LOCATOR ISSUE: nth-child positioning (brittle)
  async selectItemByPosition(position: number) {
    // BAD: Position-based selection breaks when items are reordered
    await this.page.locator(`.cart_item:nth-child(${position}) input[type="checkbox"]`).check();
  }

  // LOCATOR ISSUE: No accessibility attributes (ARCHON should suggest data-testid)
  async updateQuantity(itemName: string, quantity: number) {
    // BAD: No test ID or accessibility attributes
    const itemRow = this.page.locator('.cart_item').filter({ hasText: itemName });
    await itemRow.locator('.cart_quantity input').fill(quantity.toString());
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

