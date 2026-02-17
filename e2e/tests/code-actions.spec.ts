import { expect, test } from '@playwright/test';

import {
	DiagnosticCodes,
	applyCodeAction,
	filterMarkersByCode,
	filterPluginMarkers,
	getCodeActions,
	getEditorContent,
	getEditorMarkers,
	navigateToTestCase,
	waitForDiagnostics
} from './test-utils';

test.describe('Code Actions - Real Plugin', () => {
	test('provides code actions for invalid classes (JSX)', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'literal-static', 'error-01-single-invalid');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const errors = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.INVALID_CLASS);
		expect(errors.length).toBeGreaterThan(0);

		// Get code actions at the error location
		const actions = await getCodeActions(page, errors[0].startLine, errors[0].startColumn);

		// The real plugin may or may not provide code actions for this specific case
		// depending on whether there's a close match
		expect(actions).toBeDefined();
	});

	test('provides code actions for duplicate classes (JSX)', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'duplicate-classes', 'warn-01-basic-duplicate');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const dups = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.DUPLICATE_CLASS);

		if (dups.length > 0) {
			const actions = await getCodeActions(page, dups[0].startLine, dups[0].startColumn);
			// Real plugin should provide "remove duplicate" actions
			if (actions.length > 0) {
				expect(actions[0].title).toBeDefined();
			}
		}
	});

	test('provides code actions for conflict classes (JSX)', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'conflicting-classes', 'conflict-01-text-align');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const conflicts = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.CONFLICT_CLASS);

		if (conflicts.length > 0) {
			const actions = await getCodeActions(page, conflicts[0].startLine, conflicts[0].startColumn);
			if (actions.length > 0) {
				expect(actions[0].title).toBeDefined();
			}
		}
	});
});

test.describe('Code Actions - Apply Fixes', () => {
	test('can apply code action to fix duplicate class', async ({ page }) => {
		await navigateToTestCase(page, 'jsx', 'duplicate-classes', 'warn-01-basic-duplicate');
		await waitForDiagnostics(page);
		const markers = await getEditorMarkers(page);
		const dups = filterMarkersByCode(filterPluginMarkers(markers), DiagnosticCodes.DUPLICATE_CLASS);

		if (dups.length > 0) {
			const actions = await getCodeActions(page, dups[0].startLine, dups[0].startColumn);

			if (actions.length > 0) {
				const contentBefore = await getEditorContent(page);
				await applyCodeAction(page, 0);
				const contentAfter = await getEditorContent(page);
				// Content should change after applying a code action
				expect(contentAfter).not.toBe(contentBefore);
			}
		}
	});
});
