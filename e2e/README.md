# Browser Integration Tests

This directory contains browser-based integration tests for the Tailwind TypeScript Plugin using Monaco Editor and Playwright.

## Overview

These tests verify the plugin's behavior in a real browser environment, testing:

- **Diagnostics**: Invalid class detection, duplicate detection, conflict detection
- **Completions**: Tailwind class autocompletion triggering and filtering
- **Code Actions**: Quick fixes for typos, duplicates, and conflicts

## Architecture

```
e2e/
├── src/
│   ├── index.html      # Test harness UI
│   └── main.ts         # Monaco Editor setup with Tailwind validation
├── tests/
│   ├── test-utils.ts   # Shared test utilities
│   ├── diagnostics.spec.ts    # Diagnostic tests
│   ├── completions.spec.ts    # Completion tests
│   └── code-actions.spec.ts   # Code action tests
├── playwright.config.ts
├── package.json
└── README.md
```

## How It Works

1. **Monaco Editor Harness**: A browser-based Monaco Editor instance configured with:
   - TypeScript/TSX support
   - Custom diagnostic providers mimicking the plugin's validation logic
   - Completion providers for Tailwind classes
   - Code action providers for quick fixes

2. **Test API**: The harness exposes a `window.testAPI` object that Playwright tests use to:
   - Set/get editor content
   - Trigger and retrieve diagnostics
   - Get completion suggestions
   - Apply code actions

3. **Playwright Tests**: Automated browser tests that:
   - Navigate to the harness page
   - Interact with the editor via the test API
   - Assert on diagnostics, completions, and code actions

## Running Tests

### Prerequisites

```bash
cd e2e
npm install
npx playwright install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests with browser visible
npm run test:headed

# Run specific test file
npx playwright test diagnostics.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Development Mode

```bash
# Start the dev server to manually test the harness
npm run dev

# Then open http://localhost:5173 in your browser
```

## Test Categories

### Diagnostics Tests (`diagnostics.spec.ts`)

- Invalid class detection with suggestions
- Typo detection with "Did you mean" suggestions
- Duplicate class detection
- Conflicting class detection (e.g., `text-left` + `text-center`)
- Real-time diagnostic updates
- UI display verification

### Completion Tests (`completions.spec.ts`)

- Basic completion triggering in `className`
- Prefix-based filtering
- Context awareness (no completions outside `className`)
- Various class categories (spacing, colors, layout, etc.)

### Code Action Tests (`code-actions.spec.ts`)

- Quick fix suggestions for typos
- Applying fixes to replace invalid classes
- Removing duplicate classes
- Removing conflicting classes
- Handling multiple issues

## Extending Tests

### Adding New Test Cases

1. Create test in appropriate `.spec.ts` file
2. Use utilities from `test-utils.ts`
3. Follow existing patterns for setup/teardown

### Adding New Tailwind Classes

Edit the `TAILWIND_CLASSES` set in `src/main.ts` to add more classes for testing.

### Adding Conflict Detection

Edit the `CONFLICTING_GROUPS` object in `src/main.ts` to add new conflict rules.

## Differences from Unit Tests

| Aspect | Unit Tests (`example/`) | Browser Integration Tests |
|--------|------------------------|---------------------------|
| Environment | Node.js | Real browser |
| Editor | Mock Language Service | Monaco Editor |
| Speed | Fast (~1600 tests in seconds) | Slower (browser startup) |
| Coverage | Service logic | Full IDE experience |
| Use Case | Regression testing | E2E validation |

## CI Integration

The tests are configured to run in CI with:
- Retries on failure
- Single worker for stability
- HTML report generation
- Screenshots on failure
- Trace collection on retry

```yaml
# Example GitHub Actions step
- name: Run browser integration tests
  run: |
    cd e2e
    npm ci
    npx playwright install --with-deps
    npm test
```
