# Expected Comments for PR #2 - DroogAI Test Coverage

This document tracks expected comments that DroogAI should detect in PR #2.

## Test Files Created

1. `tests/checkout-flow.spec.ts` - Comprehensive checkout test with locator issues
2. `tests/search-and-filter.spec.ts` - Search functionality tests
3. `pages/CheckoutPage.ts` - Checkout page object with issues
4. `pages/SearchPage.ts` - Search page with unstable locators
5. `services/CheckoutService.ts` - Service with breaking changes
6. `utils/PriceCalculator.ts` - Calculator with logic bugs

---

## Expected Comments by File

### 1. `tests/checkout-flow.spec.ts`

**Language Detection:**
- ✅ Should detect: Playwright + TypeScript
- ✅ Should suggest: Modern TypeScript syntax

**Locator Issues (CRITICAL FOR TEST):**
- **Line 15**: `page.locator('//button[contains(@class, "btn-primary")]')` 
  - Expected: Suggest `page.getByRole('button', { name: /checkout/i })` or `page.getByTestId('checkout-button')`
  - Issue: XPath locator (unstable)
  - Severity: HIGH

- **Line 22**: `page.locator('#firstName')`
  - Expected: Suggest `page.getByLabel('First Name')` or `page.getByPlaceholder('First Name')`
  - Issue: ID selector (can break if ID changes)
  - Severity: MEDIUM

- **Line 28**: `page.locator('.form-input.email')`
  - Expected: Suggest `page.getByLabel('Email')` or `page.getByTestId('email-input')`
  - Issue: CSS class selector (unstable)
  - Severity: MEDIUM

- **Line 45**: `page.locator('//div[@id="cart"]//span[text()="Total"]')`
  - Expected: Suggest `page.getByTestId('cart-total')` or `page.getByRole('textbox', { name: 'Total' })`
  - Issue: Complex XPath (very unstable)
  - Severity: HIGH

- **Line 52**: `page.locator('button.btn-success')`
  - Expected: Suggest `page.getByRole('button', { name: 'Complete Order' })`
  - Issue: Class selector
  - Severity: MEDIUM

**PR Impact:**
- ✅ Should detect: This file adds new test coverage
- ✅ Should detect: Cross-file dependency (uses CheckoutPage)

**Logic Issues:**
- **Line 38**: Hardcoded timeout `page.waitForSelector('.success', { timeout: 5000 })`
  - Expected: Suggest using Playwright auto-wait or `page.waitFor()` with proper conditions
  - Issue: Hardcoded timeout violates Playwright best practices
  - Severity: MEDIUM

---

### 2. `tests/search-and-filter.spec.ts`

**Language Detection:**
- ✅ Should detect: Playwright + TypeScript

**Locator Issues:**
- **Line 18**: `page.locator('input[type="search"]')`
  - Expected: Suggest `page.getByPlaceholder('Search products...')` or `page.getByRole('searchbox')`
  - Issue: Attribute selector
  - Severity: MEDIUM

- **Line 25**: `page.locator('//div[@class="product-card"]//h3')`
  - Expected: Suggest `page.getByTestId('product-title')` or `page.getByRole('heading')`
  - Issue: XPath with class selector
  - Severity: HIGH

- **Line 35**: `page.locator('.filter-option[data-value="price"]')`
  - Expected: Suggest `page.getByTestId('filter-price')` or `page.getByRole('button', { name: 'Price' })`
  - Issue: Data attribute with class selector
  - Severity: MEDIUM

**Performance Issues:**
- **Line 42**: `await page.waitForTimeout(2000)`
  - Expected: CRITICAL - Suggest removing and using auto-wait or proper wait conditions
  - Issue: Hardcoded wait violates Playwright standards
  - Severity: HIGH

---

### 3. `pages/CheckoutPage.ts`

**Language Detection:**
- ✅ Should detect: TypeScript class
- ✅ Should suggest: Modern TypeScript (optional chaining, async/await patterns)

**Locator Issues:**
- **Line 18**: `this.page.locator('//input[@id="firstName"]')`
  - Expected: Suggest `this.page.getByLabel('First Name')`
  - Issue: XPath selector
  - Severity: HIGH

- **Line 25**: `this.page.locator('#lastName')`
  - Expected: Suggest `this.page.getByLabel('Last Name')`
  - Issue: ID selector
  - Severity: MEDIUM

- **Line 32**: `this.page.locator('.zip-code-input')`
  - Expected: Suggest `this.page.getByLabel('ZIP Code')` or `this.page.getByPlaceholder('ZIP')`
  - Issue: Class selector
  - Severity: MEDIUM

**Breaking Changes (PR IMPACT TEST):**
- **Line 45**: Method signature changed: `fillCheckoutForm(username, password, email)` → `fillCheckoutForm(userData)`
  - Expected: Should detect breaking change and find all callers
  - Expected: Should list all files that call this method (cross-file dependency)
  - Issue: Breaking change - method signature changed
  - Severity: HIGH

**Error Handling:**
- **Line 58**: Missing error handling in `submitOrder()`
  - Expected: Suggest try-catch with proper error messages
  - Issue: No error handling
  - Severity: MEDIUM

---

### 4. `pages/SearchPage.ts`

**Locator Issues:**
- **Line 15**: `this.page.locator('//input[@placeholder="Search..."]')`
  - Expected: Suggest `this.page.getByPlaceholder('Search...')`
  - Issue: XPath when simpler locator available
  - Severity: HIGH

- **Line 22**: `this.page.locator('//div[contains(@class, "result-item")]//a')`
  - Expected: Suggest `this.page.getByTestId('search-result-link')` or `this.page.getByRole('link')`
  - Issue: Complex XPath
  - Severity: HIGH

**Logic Bugs:**
- **Line 35**: Missing null check: `const results = await this.getSearchResults(); return results.length;`
  - Expected: Should detect potential null/undefined access
  - Issue: No null check before `.length`
  - Severity: MEDIUM

---

### 5. `services/CheckoutService.ts`

**Breaking Changes (PR IMPACT TEST - CRITICAL):**
- **Line 20**: Method `processPayment(amount, cardNumber)` changed to `processPayment(paymentData: PaymentData)`
  - Expected: Should detect ALL files calling this method
  - Expected: Should show exact line numbers where this method is called
  - Expected: Should predict which files will break
  - Issue: Breaking change - parameter structure changed
  - Severity: CRITICAL

- **Line 45**: Method `calculateTax(amount)` signature changed (now requires `country` parameter)
  - Expected: Cross-file dependency analysis
  - Expected: List all callers with file:line numbers
  - Issue: Breaking change
  - Severity: HIGH

**Security Issues:**
- **Line 30**: Hardcoded API key: `const apiKey = 'sk-live-1234567890abcdef';`
  - Expected: Should detect and suggest environment variables
  - Issue: Hardcoded secret
  - Severity: CRITICAL

**Logic Bugs:**
- **Line 55**: Division by zero potential: `const discount = total / discountRate;`
  - Expected: Should detect if `discountRate` can be 0
  - Issue: No validation for discountRate === 0
  - Severity: HIGH

---

### 6. `utils/PriceCalculator.ts`

**Language Detection:**
- ✅ Should detect: TypeScript utility class

**Logic Bugs:**
- **Line 18**: Missing null check: `const price = product.price * quantity;`
  - Expected: Should check if `product.price` is null/undefined
  - Issue: Potential null access
  - Severity: MEDIUM

- **Line 25**: Division by zero: `const average = total / items.length;`
  - Expected: Should check if `items.length === 0`
  - Issue: Can divide by zero
  - Severity: HIGH

- **Line 35**: Missing validation: `const tax = amount * taxRate;`
  - Expected: Should validate `taxRate` is between 0-1
  - Issue: No input validation
  - Severity: MEDIUM

**Performance Issues:**
- **Line 42**: String concatenation in loop: `result += item.name + ': ' + item.price + '\n';`
  - Expected: Suggest using array.join() or template literals
  - Issue: String concatenation in loop (O(n²))
  - Severity: MEDIUM

---

## Summary of Expected Detections

### Locator Suggestions: **8 issues**
- XPath locators: 5 (should suggest getByRole/getByTestId)
- ID selectors: 2 (should suggest getByLabel/getByPlaceholder)
- Class selectors: 3 (should suggest getByTestId/getByRole)

### PR Impact Analysis: **2 breaking changes**
- CheckoutService.processPayment() - should find all callers
- CheckoutService.calculateTax() - should find all callers
- CheckoutPage.fillCheckoutForm() - should find all callers

### Language Detection: **All files**
- Should detect: TypeScript + Playwright
- Should suggest: Modern TypeScript syntax

### Security Issues: **1 critical**
- Hardcoded API key in CheckoutService.ts:30

### Logic Bugs: **4 issues**
- Division by zero: 2
- Missing null checks: 2

### Performance Issues: **2 issues**
- Hardcoded waits: 1 (should suggest auto-wait)
- String concatenation in loop: 1

---

## Total Expected Comments: **~20-25**

**Breakdown:**
- Locator suggestions: 8-10
- Breaking changes (with callers): 2-3
- Logic bugs: 4
- Security: 1
- Performance: 2
- Code quality: 3-5

