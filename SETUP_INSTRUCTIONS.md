# Setup Instructions for DroogAI Testing

## Project Structure

```
D:\saucedemo-automation\
├── pages/              # Page Object Model classes (with intentional issues)
├── tests/              # Test files (with intentional issues)
├── services/           # Service classes (with intentional issues)
├── utils/              # Utility helpers (with intentional issues)
├── package.json        # Project dependencies
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Git Branches

- **master**: Initial commit with basic structure
- **feature/comprehensive-tests**: Branch with all test files containing intentional issues

## Next Steps

### 1. Push to GitHub

```bash
cd D:\saucedemo-automation

# Add remote (replace with your repo)
git remote add origin https://github.com/your-username/saucedemo-automation.git

# Push master branch
git checkout master
git push -u origin master

# Push feature branch
git checkout feature/comprehensive-tests
git push -u origin feature/comprehensive-tests
```

### 2. Create Pull Request

- Go to GitHub repository
- Create PR from `feature/comprehensive-tests` to `master`

### 3. Index Master Branch with DroogAI

```bash
cd D:\DROOG AI
npx tsx src/index.ts index --repo your-username/saucedemo-automation --branch master
```

### 4. Run DroogAI Review

```bash
cd D:\DROOG AI
npx tsx src/index.ts review --repo your-username/saucedemo-automation --pr <PR_NUMBER> --enterprise --post
```

## What Will Be Tested

This project contains **intentional issues** to test all 31 DroogAI analysis modules:

- ✅ Security issues (hardcoded secrets, SQL injection, XSS)
- ✅ Performance issues (string concatenation, N+1 queries, memory leaks)
- ✅ Code smells (long methods, god objects, feature envy)
- ✅ Duplicate code (within-PR and cross-repo)
- ✅ Complexity issues (high cyclomatic complexity)
- ✅ Error handling issues (swallowed exceptions, generic catches)
- ✅ Missing documentation
- ✅ Observability issues (missing logging)
- ✅ Logic bugs (off-by-one, null checks, division by zero)
- ✅ Magic numbers and hardcoded values
- ✅ Design patterns (good and anti-patterns)
- ✅ Breaking changes (method signature changes)
- ✅ Test coverage issues
- ✅ Modern practices (old-style code)

See `DROOGAI_TEST_COVERAGE.md` for complete list of issues.

