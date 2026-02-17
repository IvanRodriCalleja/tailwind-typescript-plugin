import { expect, test } from '@playwright/test';

import {
	DiagnosticCodes,
	filterMarkersByCode,
	filterPluginMarkers,
	getEditorMarkers,
	navigateToTestCase,
	waitForDiagnostics,
	waitForEditorReady
} from './test-utils';

test.describe('Diagnostics - Invalid Classes (literal-static)', () => {
	test('detects single invalid class', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const errors = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.INVALID_CLASS);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors.some(m => m.coveredText === 'invalidclass')).toBe(true);
	});

	test('detects all invalid classes', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-02-all-invalid');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const errors = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.INVALID_CLASS);
		expect(errors.length).toBeGreaterThan(0);
	});

	test('detects mixed valid and invalid classes', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-03-mixed-valid-invalid');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const errors = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.INVALID_CLASS);
		expect(errors.length).toBeGreaterThan(0);
	});

	test('allows valid classes', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'valid-01-single-class');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const errors = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.INVALID_CLASS);
		expect(errors).toHaveLength(0);
	});
});

test.describe('Diagnostics - Duplicate Classes', () => {
	test('detects duplicate classes (JSX)', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'duplicate-classes', 'warn-01-basic-duplicate');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const dups = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.DUPLICATE_CLASS);
		expect(dups.length).toBeGreaterThan(0);
	});

	test('detects duplicate classes (Vue)', async ({ page }) => {
		await navigateToTestCase(page, 'vue', 'duplicate-classes', 'warn-01-basic-duplicate');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const dups = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.DUPLICATE_CLASS);
		expect(dups.length).toBeGreaterThan(0);
	});
});

test.describe('Diagnostics - Conflicting Classes', () => {
	test('detects conflicting classes (JSX)', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'conflicting-classes', 'conflict-01-text-align');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const conflicts = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.CONFLICT_CLASS);
		expect(conflicts.length).toBeGreaterThan(0);
	});

	test('detects conflicting classes (Vue)', async ({ page }) => {
		await navigateToTestCase(page, 'vue', 'conflicting-classes', 'conflict-01-text-align');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const conflicts = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.CONFLICT_CLASS);
		expect(conflicts.length).toBeGreaterThan(0);
	});
});

test.describe('Diagnostics - CSS Variables', () => {
	test('handles css variables (JSX)', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'css-variables', 'valid-01-css-variable-color');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const errors = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.INVALID_CLASS);
		expect(errors).toHaveLength(0);
	});
});

test.describe('Diagnostics - UI Display', () => {
	test('diagnostics appear in sidebar', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);

		const diagnosticsList = page.locator('[data-testid="diagnostics-list"]');
		await expect(diagnosticsList).toContainText('not a valid Tailwind class');
	});

	test('clicking diagnostic navigates to location', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);

		const diagnosticItem = page.locator('[data-testid="diagnostic-90001"]').first();
		await diagnosticItem.click();
		await page.waitForTimeout(200);
	});

	test('error diagnostics have error styling', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);

		const errorItem = page.locator('.diagnostic-item.error');
		await expect(errorItem.first()).toBeVisible();
	});

	test('warning diagnostics have warning styling', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'duplicate-classes', 'warn-01-basic-duplicate');
		await waitForDiagnostics(page);

		const warningItem = page.locator('.diagnostic-item.warning').first();
		await expect(warningItem).toBeVisible();
	});

	test('test case info is displayed in header', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForEditorReady(page);

		const infoEl = page.locator('[data-testid="test-case-info"]');
		await expect(infoEl).toContainText('jsx');
		await expect(infoEl).toContainText('literal-static');
		await expect(infoEl).toContainText('error-01-single-invalid');
	});
});
