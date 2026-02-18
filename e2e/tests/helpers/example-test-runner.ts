/**
 * Shared assertion logic and helpers for running example directory tests as e2e tests.
 * Used by all-examples.spec.ts to assert diagnostics match JSDoc annotations.
 */
import { expect, type APIRequestContext } from '@playwright/test';
import type { EditorMarkerInfo } from '../test-utils';

export interface TestCaseExpectations {
	shouldBeValid: boolean;
	comment: string;
	invalidClasses: string[];
	validClasses: string[];
	duplicateClasses: string[];
	extractableClasses: string[];
	conflictClasses: string[];
}

export interface TestCaseInfoResponse {
	code: string;
	language: string;
	config: Record<string, unknown>;
	filePath: string;
	framework: string;
	category: string;
	name: string;
	expectations: TestCaseExpectations;
}

export const DiagnosticCodes = {
	INVALID_CLASS: 90001,
	DUPLICATE_CLASS: 90002,
	EXTRACTABLE_CLASS: 90003,
	CONFLICT_CLASS: 90004,
} as const;

/**
 * Fetch test case info (including expectations) from the backend.
 */
export async function fetchTestCaseInfo(
	request: APIRequestContext,
	framework: string,
	category: string,
	name: string,
): Promise<TestCaseInfoResponse> {
	const res = await request.get(`/api/test-case/${framework}/${category}/${name}`);
	return res.json();
}

/**
 * Filter markers to only plugin-produced markers.
 */
function filterPluginMarkers(markers: EditorMarkerInfo[]): EditorMarkerInfo[] {
	return markers.filter(
		m => m.source === 'tw-plugin' || m.source === 'tailwind-typescript-plugin',
	);
}

/**
 * Assert Monaco editor markers for a test case based on its name prefix and JSDoc expectations.
 *
 * Instead of checking diagnostic messages, this verifies the **exact text each marker covers**
 * (the squiggly underline spans), ensuring the full pipeline is correct:
 * plugin diagnostic spans → line/column mapping → Monaco marker placement → correct text underlined.
 *
 * Handles all annotation types:
 * - error-* prefix: expects INVALID_CLASS (90001) markers
 *   - @invalidClasses: each listed class must be covered by a 90001 marker
 *   - @validClasses: none of these should be covered by 90001 markers
 * - valid-* prefix: expects NO INVALID_CLASS markers
 * - warn-* / duplicate-* prefix: expects DUPLICATE_CLASS (90002) markers
 *   - @duplicateClasses: each listed class must be covered by a 90002 marker
 * - extractable-* / hint-* prefix: expects EXTRACTABLE_CLASS (90003) markers
 *   - @extractableClasses: each listed class must be covered by a 90003 marker
 * - conflict-* prefix: expects CONFLICT_CLASS (90004) markers
 *   - @conflictClasses: each listed class must be covered by a 90004 marker
 */
export function assertDiagnostics(
	markers: EditorMarkerInfo[],
	expectations: TestCaseExpectations,
	testName: string,
): void {
	const twMarkers = filterPluginMarkers(markers);

	// --- INVALID CLASS assertions (90001) ---
	const invalidMarkers = twMarkers.filter(m => m.code === DiagnosticCodes.INVALID_CLASS);

	if (testName.startsWith('valid-')) {
		expect(
			invalidMarkers,
			`Expected no invalid class markers for valid test "${testName}"`,
		).toHaveLength(0);
	}

	if (testName.startsWith('error-')) {
		const hasOtherAnnotations =
			expectations.duplicateClasses.length > 0 ||
			expectations.conflictClasses.length > 0 ||
			expectations.extractableClasses.length > 0;

		if (expectations.invalidClasses.length > 0 || !hasOtherAnnotations) {
			expect(
				invalidMarkers.length,
				`Expected invalid class markers for error test "${testName}"`,
			).toBeGreaterThan(0);
		}

		if (expectations.invalidClasses.length > 0) {
			for (const expectedClass of expectations.invalidClasses) {
				const found = invalidMarkers.some(m => m.coveredText === expectedClass);
				expect(
					found,
					`Expected 90001 marker covering "${expectedClass}" in "${testName}", ` +
						`but markers cover: [${invalidMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
				).toBe(true);
			}
		}

		if (expectations.validClasses.length > 0) {
			for (const validClass of expectations.validClasses) {
				const found = invalidMarkers.some(m => m.coveredText === validClass);
				expect(
					found,
					`Valid class "${validClass}" should NOT have a 90001 marker in "${testName}"`,
				).toBe(false);
			}
		}
	}

	// --- DUPLICATE CLASS assertions (90002) ---
	const duplicateMarkers = twMarkers.filter(m => m.code === DiagnosticCodes.DUPLICATE_CLASS);

	if (testName.startsWith('warn-') || testName.startsWith('duplicate-')) {
		if (expectations.duplicateClasses.length > 0) {
			expect(
				duplicateMarkers.length,
				`Expected duplicate markers for "${testName}"`,
			).toBeGreaterThan(0);

			for (const expectedClass of expectations.duplicateClasses) {
				const found = duplicateMarkers.some(m => m.coveredText === expectedClass);
				expect(
					found,
					`Expected 90002 marker covering "${expectedClass}" in "${testName}", ` +
						`but markers cover: [${duplicateMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
				).toBe(true);
			}
		}
	}

	// --- EXTRACTABLE CLASS assertions (90003) ---
	const extractableMarkers = twMarkers.filter(m => m.code === DiagnosticCodes.EXTRACTABLE_CLASS);

	if (testName.startsWith('extractable-') || testName.startsWith('hint-')) {
		if (expectations.extractableClasses.length > 0) {
			expect(
				extractableMarkers.length,
				`Expected extractable markers for "${testName}"`,
			).toBeGreaterThan(0);

			for (const expectedClass of expectations.extractableClasses) {
				const found = extractableMarkers.some(m => m.coveredText === expectedClass);
				expect(
					found,
					`Expected 90003 marker covering "${expectedClass}" in "${testName}", ` +
						`but markers cover: [${extractableMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
				).toBe(true);
			}
		}
	}

	// --- CONFLICT CLASS assertions (90004) ---
	const conflictMarkers = twMarkers.filter(m => m.code === DiagnosticCodes.CONFLICT_CLASS);

	if (testName.startsWith('conflict-')) {
		if (expectations.conflictClasses.length > 0) {
			expect(
				conflictMarkers.length,
				`Expected conflict markers for "${testName}"`,
			).toBeGreaterThan(0);

			for (const expectedClass of expectations.conflictClasses) {
				const found = conflictMarkers.some(m => m.coveredText === expectedClass);
				expect(
					found,
					`Expected 90004 marker covering "${expectedClass}" in "${testName}", ` +
						`but markers cover: [${conflictMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
				).toBe(true);
			}
		}
	}

	// --- Cross-cutting: check annotation-based assertions regardless of prefix ---
	if (
		!testName.startsWith('warn-') &&
		!testName.startsWith('duplicate-') &&
		expectations.duplicateClasses.length > 0
	) {
		for (const expectedClass of expectations.duplicateClasses) {
			const found = duplicateMarkers.some(m => m.coveredText === expectedClass);
			expect(
				found,
				`Expected 90002 marker covering "${expectedClass}" in "${testName}" (cross-cutting), ` +
					`but markers cover: [${duplicateMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
			).toBe(true);
		}
	}

	if (
		!testName.startsWith('extractable-') &&
		!testName.startsWith('hint-') &&
		expectations.extractableClasses.length > 0
	) {
		for (const expectedClass of expectations.extractableClasses) {
			const found = extractableMarkers.some(m => m.coveredText === expectedClass);
			expect(
				found,
				`Expected 90003 marker covering "${expectedClass}" in "${testName}" (cross-cutting), ` +
					`but markers cover: [${extractableMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
			).toBe(true);
		}
	}

	if (!testName.startsWith('conflict-') && expectations.conflictClasses.length > 0) {
		for (const expectedClass of expectations.conflictClasses) {
			const found = conflictMarkers.some(m => m.coveredText === expectedClass);
			expect(
				found,
				`Expected 90004 marker covering "${expectedClass}" in "${testName}" (cross-cutting), ` +
					`but markers cover: [${conflictMarkers.map(m => `"${m.coveredText}"`).join(', ')}]`,
			).toBe(true);
		}
	}
}
