# SauceDemo Automation - Playwright TypeScript Project

This is a comprehensive Playwright automation project for testing https://www.saucedemo.com/

## Purpose

This project is designed to test all capabilities of TESLON code review system by including various code patterns, issues, and best practices.

## 🆕 New Features

- Enhanced checkout flow with new payment methods
- Improved login functionality with remember me option
- Better error handling in user services
- New step definitions for checkout scenarios

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test
```

## Project Structure

- `pages/` - Page Object Model classes
- `tests/` - Test files
- `utils/` - Utility functions
- `services/` - Service classes
- `features/` - Gherkin feature files
- `step-definitions/` - Cucumber step definitions

## Recent Changes

This PR includes comprehensive changes to test TESLON analysis:
- Breaking changes (function signatures, method deletions)
- Safe changes (new methods, implementation improvements)
- No impact changes (tests, documentation)
