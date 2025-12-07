# DroogAI Test Coverage - Intentional Issues

This project is designed to test **ALL** capabilities of DroogAI code review system.

## 🎯 Purpose

Every file in this project contains **intentional issues** to test DroogAI's detection capabilities across all 31 analysis modules.

---

## 📋 Issues by Category

### 1. **Security Issues** 🔴

#### Hardcoded Secrets
- `LoginPage.ts`: Hardcoded API key (`sk-1234567890...`)
- `TestDataHelper.ts`: Hardcoded credentials and API token
- `AuthService.ts`: Hardcoded API key (`sk-live-1234567890...`)
- `ConfigHelper.ts`: Hardcoded credentials

#### SQL Injection Patterns
- `ProductPage.ts`: `buildQuery()` - SQL injection risk pattern
- `LoginPage.ts`: String concatenation in queries

#### XSS Vulnerabilities
- `ProductPage.ts`: `displayUserInput()` - XSS risk (unescaped HTML)

---

### 2. **Performance Issues** ⚡

#### String Concatenation in Loops
- `LoginPage.ts`: `buildErrorMessage()` - O(n²) string operations
- `TestDataHelper.ts`: `buildTestData()` - String concatenation in loop

#### Inefficient Loops
- `CartPage.ts`: `getAllCartItems()` - Should use `map()` instead of manual loop
- `TestDataHelper.ts`: `findUser()` - O(n) linear search, should use Set/Map

#### N+1 Query Problems
- `ProductPage.ts`: `getProductDetails()` - N+1 query pattern

#### Memory Leaks
- `CartPage.ts`: `processCartItems()` - Unclosed resources (ItemProcessor)

#### Unnecessary Object Creation
- `DataGenerator.ts`: `createProductList()` - Creates objects in loop
- `ConfigHelper.ts`: `getDefaultHeaders()` - Creates new object each call

#### Caching Opportunities
- `DataGenerator.ts`: `calculateTotal()` - Recalculates same values

---

### 3. **Code Smells** 💩

#### Long Methods
- `LoginPage.ts`: `complexLoginFlow()` - >50 lines, too many responsibilities

#### God Object
- `ProductPage.ts`: Too many responsibilities (cart, products, navigation, validation)

#### Feature Envy
- `ProductPage.ts`: `processOrder()` - Uses Order class data more than own

#### Primitive Obsession
- `ProductPage.ts`: `createProduct()` - Too many primitive parameters, should use object

#### Dead Code
- `CartPage.ts`: `unusedMethod()` - Never called
- `tests/login.spec.ts`: `unused test` - Dead test

---

### 4. **Duplicate Code** 🔄

#### Within-PR Duplicates
- `LoginPage.ts` & `ProductPage.ts`: Both have `login()` method with same signature
- `ProductPage.ts` & `CartPage.ts`: Both have `getCartCount()` and `navigateToCart()`
- `TestDataHelper.ts` & `DataGenerator.ts`: Both have similar `generateUserData()` / `generate()`
- `TestDataHelper.ts` & `ValidationHelper.ts`: Both have `validateAge()` method

#### Cross-Repo Duplicates
- Will be detected when compared with master branch (if indexed)

---

### 5. **Complexity Issues** 🧩

#### High Cyclomatic Complexity
- `ProductPage.ts`: `filterProducts()` - >10 complexity (nested if-else)
- `OrderService.ts`: `calculateTotal()` - High cognitive complexity

#### Complexity Hotspots
- Multiple methods with complexity >5, >7, >10

---

### 6. **Error Handling Issues** ⚠️

#### Swallowed Exceptions
- `LoginPage.ts`: `safeLogin()` - Empty catch block

#### Generic Exception Catches
- `LoginPage.ts`: `loginWithRetry()` - Catches generic `Exception`
- `ValidationHelper.ts`: `safeValidate()` - Generic catch

#### Missing Error Handling
- `CartPage.ts`: `checkout()` - No error handling
- `AuthService.ts`: `refreshToken()` - Missing error handling

---

### 7. **Missing Documentation** 📝

#### No JSDoc/Comments
- `LoginPage.ts`: `validateLoginForm()` - No documentation
- `AuthService.ts`: `validateToken()` - No documentation
- `ConfigHelper.ts`: `getApiEndpoint()` - No documentation

---

### 8. **Observability Issues** 📊

#### Missing Logging
- `LoginPage.ts`: `performLogin()` - No logging
- `OrderService.ts`: `submitOrder()` - No logging

#### Missing Error Logging
- Multiple methods don't log errors

---

### 9. **Logic Bugs** 🐛

#### Off-by-One Errors
- `CartPage.ts`: `getItemByIndex()` - No bounds checking

#### Missing Null Checks
- `LoginPage.ts`: `getErrorMessage()` - Will throw NPE if page is null
- `TestDataHelper.ts`: `formatUser()` - No null check
- `ValidationHelper.ts`: `validateEmail()` - No null check

#### Missing Validation
- `CartPage.ts`: `removeItem()` - No validation for empty string
- `LoginPage.ts`: `calculateRetryDelay()` - Division by zero risk

#### Division by Zero
- `LoginPage.ts`: `calculateRetryDelay()` - No check if attempts is 0

---

### 10. **Magic Numbers & Hardcoded Values** 🔢

#### Magic Numbers
- `LoginPage.ts`: `waitForLogin()` - Magic number 30
- `TestDataHelper.ts`: `validateAge()` - Magic numbers 18, 100
- `ConfigHelper.ts`: `TIMEOUT`, `RETRY_COUNT` - Should be constants

#### Hardcoded Values
- `TestDataHelper.ts`: `getApiUrl()` - Hardcoded URL
- `ConfigHelper.ts`: `BASE_URL` - Should use env var

---

### 11. **Design Patterns** 🏗️

#### Good Patterns (Should be Detected)
- `AuthService.ts`: Singleton Pattern ✅
- `AuthService.ts`: Factory Pattern ✅

#### Anti-Patterns (Should be Flagged)
- `ProductPage.ts`: God Object ❌
- `LoginPage.ts`: Long Method ❌

---

### 12. **Breaking Changes** 🔨

#### Method Signature Changes
- `OrderService.ts`: `processPayment()` - Will change visibility in PR
- `OrderService.ts`: `getOrderStatus()` - Will change return type in PR

---

### 13. **Test Coverage Issues** 🧪

#### Missing Test Cases
- `tests/login.spec.ts`: No tests for error scenarios
- `tests/products.spec.ts`: Limited edge cases

#### Dead Tests
- `tests/login.spec.ts`: Unused test

---

### 14. **Modern Practices** ✨

#### Old-Style Code (Should Suggest Modern)
- String concatenation instead of template literals
- Manual loops instead of array methods (map, filter, etc.)
- No use of Optional/Null safety patterns
- No use of modern TypeScript features

---

## 📊 DroogAI Features Tested

### ✅ Code Quality (6 modules)
- [x] Duplicate Detection
- [x] Code Smells
- [x] Complexity Analysis
- [x] Code Organization
- [x] Technical Debt
- [x] Pattern Detection

### ✅ Security (1 module)
- [x] Hardcoded Secrets
- [x] SQL Injection
- [x] XSS Vulnerabilities
- [x] OWASP Top 10

### ✅ Performance (2 modules)
- [x] String Concatenation in Loops
- [x] Inefficient Loops
- [x] N+1 Query Problems
- [x] Memory Leaks
- [x] Caching Opportunities
- [x] Performance Regression Detection

### ✅ Architecture (4 modules)
- [x] Design Patterns
- [x] Anti-Patterns
- [x] Breaking Changes
- [x] Dependency Mapping

### ✅ Testing (3 modules)
- [x] Test Coverage
- [x] Test Impact
- [x] Test Automation Framework Review

### ✅ Documentation (1 module)
- [x] Missing Documentation
- [x] Documentation Quality

### ✅ Dependencies (2 modules)
- [ ] Security Vulnerabilities (CVE) - Will check package.json
- [ ] Unused Dependencies

### ✅ Test Automation (6 modules)
- [x] Framework Detection (Playwright)
- [x] Page Object Model
- [x] Locator Strategy
- [x] Best Practices Review

### ✅ Intelligence (6 modules)
- [x] Codebase Knowledge
- [x] Pattern Memory
- [x] Code Reuse Opportunities
- [x] Context-Aware Suggestions

---

## 🚀 How to Test DroogAI

1. **Index the master branch:**
   ```bash
   cd D:\DROOG AI
   npx tsx src/index.ts index --repo owner/saucedemo-automation --branch master
   ```

2. **Create a PR with feature branch:**
   - Push master branch to GitHub
   - Push feature/comprehensive-tests branch
   - Create PR

3. **Run DroogAI Review:**
   ```bash
   npx tsx src/index.ts review --repo owner/saucedemo-automation --pr <PR_NUMBER> --enterprise --post
   ```

4. **Verify All Issues Detected:**
   - Check that all security issues are found
   - Check that all performance issues are found
   - Check that all code smells are found
   - Check that duplicates are detected
   - Check that breaking changes are detected
   - Check that all other issues are found

---

## 📝 Notes

- All issues are **intentional** for testing purposes
- This project should NOT be used as a reference for best practices
- The goal is to test DroogAI's detection capabilities comprehensively

