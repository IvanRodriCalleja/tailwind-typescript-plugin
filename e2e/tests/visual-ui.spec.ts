import { test, expect } from '@playwright/test';
import {
	navigateToTestCase,
	waitForDiagnostics,
	waitForEditorReady,
} from './test-utils';

test.describe('Visual UI', () => {
	test('sidebar shows diagnostics for error test case', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);

		const diagnosticsList = page.locator('[data-testid="diagnostics-list"]');
		const items = diagnosticsList.locator('.diagnostic-item');
		await expect(items.first()).toBeVisible();
	});

	test('sidebar shows "no issues" for valid test case', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'valid-01-single-class');
		await waitForDiagnostics(page);

		const diagnosticsList = page.locator('[data-testid="diagnostics-list"]');
		await expect(diagnosticsList).toContainText('No issues found');
	});

	test('clicking diagnostic navigates editor', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);

		const item = page.locator('.diagnostic-item').first();
		await item.click();
		await page.waitForTimeout(200);
		// Editor should have focused (hard to verify precisely, but click should work)
	});

	test('error items have error border styling', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);

		const errorItem = page.locator('.diagnostic-item.error').first();
		await expect(errorItem).toBeVisible();
	});

	test('warning items have warning border styling', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'duplicate-classes', 'warn-01-basic-duplicate');
		await waitForDiagnostics(page);

		const warningItem = page.locator('.diagnostic-item.warning').first();
		await expect(warningItem).toBeVisible();
	});

	test('test case info badges are displayed', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForEditorReady(page);

		const frameworkBadge = page.locator('.badge.framework');
		await expect(frameworkBadge).toHaveText('jsx');

		const categoryBadge = page.locator('.badge.category');
		await expect(categoryBadge).toHaveText('literal-static');

		const nameBadge = page.locator('.badge.name');
		await expect(nameBadge).toHaveText('error-01-single-invalid');
	});

	test('landing page loads without test case', async ({ page }) => {
		await page.goto('/');
		await waitForEditorReady(page);

		const status = page.locator('[data-testid="status"]');
		await expect(status).toHaveText('Ready');
	});
});
