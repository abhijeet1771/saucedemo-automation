import { test, expect } from '@playwright/test';

test.describe('Search and Filter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
  });

  test('should search for products', async ({ page }) => {
    // ISSUE: Attribute selector (Line 18) - Should suggest getByPlaceholder or getByRole('searchbox')
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('backpack');

    // Wait for search results
    // ISSUE: XPath with class selector (Line 25) - Should suggest getByTestId
    const firstResult = page.locator('//div[@class="product-card"]//h3');
    await expect(firstResult).toBeVisible();

    // Verify search worked
    const resultCount = await firstResult.count();
    expect(resultCount).toBeGreaterThan(0);
  });

  test('should filter products by price', async ({ page }) => {
    // ISSUE: Data attribute with class (Line 35) - Should suggest getByTestId
    await page.locator('.filter-option[data-value="price"]').click();

    // Wait for filtered results
    // ISSUE: CRITICAL - Hardcoded wait (Line 42) - Should use auto-wait or waitFor
    await page.waitForTimeout(2000);

    // Verify products are sorted by price
    const prices = await page.locator('.product-price').allTextContents();
    const sortedPrices = [...prices].sort((a, b) => {
      const priceA = parseFloat(a.replace('$', ''));
      const priceB = parseFloat(b.replace('$', ''));
      return priceA - priceB;
    });

    expect(prices).toEqual(sortedPrices);
  });

  test('should clear search filters', async ({ page }) => {
    await page.locator('input[type="search"]').fill('test');
    await page.locator('.clear-filter-button').click();

    // Verify all products are visible again
    const allProducts = await page.locator('.product-item').count();
    expect(allProducts).toBeGreaterThan(0);
  });
});

