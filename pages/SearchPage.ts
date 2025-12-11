import { Page } from '@playwright/test';

export class SearchPage {
  constructor(private page: Page) {}

  /**
   * Search for products
   */
  async searchProduct(query: string): Promise<void> {
    // ISSUE: XPath when simpler locator available (Line 15)
    // Should suggest: this.page.getByPlaceholder('Search...')
    await this.page.locator('//input[@placeholder="Search..."]').fill(query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Get search results
   */
  async getSearchResults(): Promise<Array<{ name: string; price: string }>> {
    // ISSUE: Complex XPath (Line 22) - Should suggest getByTestId('search-result-link')
    const resultLinks = await this.page.locator('//div[contains(@class, "result-item")]//a').all();
    
    const results = [];
    for (const link of resultLinks) {
      const name = await link.textContent();
      const price = await link.getAttribute('data-price');
      if (name && price) {
        results.push({ name: name.trim(), price });
      }
    }
    return results;
  }

  /**
   * Get search result count
   * ISSUE: Missing null check (Line 35)
   */
  async getResultCount(): Promise<number> {
    const results = await this.getSearchResults();
    return results.length; // What if getSearchResults() returns null/undefined?
  }

  async clearSearch(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear' }).click();
  }

  async isSearchEmpty(): Promise<boolean> {
    const count = await this.getResultCount();
    return count === 0;
  }
}

