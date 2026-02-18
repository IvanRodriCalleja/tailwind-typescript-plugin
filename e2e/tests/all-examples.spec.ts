/**
 * Comprehensive E2E tests for ALL example test cases (~1,685 tests).
 *
 * Discovers every test case from the example directory at parse time
 * (using synchronous fs reads) and creates one Playwright test() per case.
 * Each test navigates to its URL, waits for the real plugin to produce
 * diagnostics, then asserts they match the JSDoc annotations.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';
import { waitForEditorReady, waitForDiagnostics, getEditorMarkers } from './test-utils';
import { assertDiagnostics, fetchTestCaseInfo } from './helpers/example-test-runner';

// --- Discover all test cases at parse time ---

interface DiscoveredTestCase {
	framework: string;
	category: string;
	name: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exampleDir = path.resolve(__dirname, '../../example');

function discoverTestCases(): DiscoveredTestCase[] {
	const cases: DiscoveredTestCase[] = [];

	for (const framework of ['jsx', 'vue'] as const) {
		const frameworkDir = path.join(exampleDir, 'src', framework);
		if (!fs.existsSync(frameworkDir)) continue;

		const categories = fs
			.readdirSync(frameworkDir, { withFileTypes: true })
			.filter(d => d.isDirectory())
			.map(d => d.name);

		for (const category of categories) {
			const categoryDir = path.join(frameworkDir, category);
			const testDirs = fs
				.readdirSync(categoryDir, { withFileTypes: true })
				.filter(d => d.isDirectory())
				.map(d => d.name);

			for (const name of testDirs) {
				// Skip directories that don't have an example file
				const ext = framework === 'vue' ? '.vue' : '.tsx';
				const exampleFile = path.join(categoryDir, name, `example${ext}`);
				if (!fs.existsSync(exampleFile)) continue;

				cases.push({ framework, category, name });
			}
		}
	}

	return cases;
}

const allTestCases = discoverTestCases();

// --- Group by framework → category ---

const grouped = new Map<string, Map<string, DiscoveredTestCase[]>>();

for (const tc of allTestCases) {
	if (!grouped.has(tc.framework)) {
		grouped.set(tc.framework, new Map());
	}
	const categories = grouped.get(tc.framework)!;
	if (!categories.has(tc.category)) {
		categories.set(tc.category, []);
	}
	categories.get(tc.category)!.push(tc);
}

// --- Generate tests ---

for (const [framework, categories] of grouped) {
	test.describe(framework, () => {
		for (const [category, cases] of categories) {
			test.describe(category, () => {
				for (const tc of cases) {
					test(tc.name, async ({ page, request }) => {
						// Navigate to the test case URL
						await page.goto(`/${tc.framework}/${tc.category}/${tc.name}`);
						await waitForEditorReady(page);

						// Trigger backend diagnostics → sets Monaco markers
						await waitForDiagnostics(page);

						// Read actual Monaco markers (squiggly underlines with positions)
						const markers = await getEditorMarkers(page);

						// Fetch expectations from the backend
						const info = await fetchTestCaseInfo(
							request,
							tc.framework,
							tc.category,
							tc.name,
						);

						// Assert markers cover the correct class text
						assertDiagnostics(markers, info.expectations, tc.name);
					});
				}
			});
		}
	});
}
