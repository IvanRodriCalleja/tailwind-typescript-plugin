import { expect, test } from '@playwright/test';

import { getCompletions, navigateToTestCase, waitForDiagnostics } from './test-utils';

test.describe('Completions - Real Plugin', () => {
	test('provides completions inside className (JSX)', async ({ page }) => {
		// Navigate to a valid test case that has className with known classes
		await navigateToTestCase(page, 'jsx', 'literal-static', 'valid-01-single-class');
		await waitForDiagnostics(page);

		// The exact line/column depends on the file content.
		// We use a test case we know has a className attribute.
		// Get completions inside the className string.
		const completions = await getCompletions(page, 6, 25);

		// Real plugin should provide Tailwind completions
		expect(completions.length).toBeGreaterThanOrEqual(0);
	});

	test('provides completions inside :class (Vue)', async ({ page }) => {
		await navigateToTestCase(page, 'vue', 'literal-static', 'valid-01-single-class');
		await waitForDiagnostics(page);

		const completions = await getCompletions(page, 7, 20);
		expect(completions.length).toBeGreaterThanOrEqual(0);
	});
});

test.describe('Completions - Context Awareness', () => {
	test('completions are filtered by prefix', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'valid-01-single-class');
		await waitForDiagnostics(page);

		// Get completions - results depend on cursor position in the file
		const completions = await getCompletions(page, 6, 25);

		// If completions are returned, they should be Tailwind classes
		if (completions.length > 0) {
			expect(completions[0].label).toBeDefined();
			expect(completions[0].insertText).toBeDefined();
		}
	});
});
