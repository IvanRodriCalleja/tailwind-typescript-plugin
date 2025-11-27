import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	FolderTestCase,
	PluginInstance,
	createDuplicateTestAssertion,
	parseTestFolder,
	runPluginOnFolder
} from '../test/test-helpers';

describe('E2E Tests - CVA Duplicate Class Detection', () => {
	const testFolder = path.join(__dirname, 'cva-duplicate-classes');
	const testCases = parseTestFolder(testFolder);
	let fileResults: Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>;
	let plugins: PluginInstance[];

	beforeAll(async () => {
		const result = await runPluginOnFolder(testFolder);
		fileResults = result.results;
		plugins = result.plugins;
	});

	afterAll(() => {
		// Clean up plugins to close file watchers
		plugins.forEach(plugin => plugin.dispose());
	});

	it('should parse test cases from folder', () => {
		expect(testCases.length).toBeGreaterThan(0);
		// Count cases with duplicates and valid cases
		const duplicateCases = testCases.filter(tc => tc.expectedDuplicateClasses.length > 0);
		const validCases = testCases.filter(tc => tc.shouldBeValid);
		expect(duplicateCases.length).toBeGreaterThan(0);
		expect(validCases.length).toBeGreaterThan(0);
	});

	// Generate a test for each test case automatically
	testCases.forEach((testCase: FolderTestCase) => {
		const hasDuplicates = testCase.expectedDuplicateClasses.length > 0;
		let prefix = '✅';
		if (hasDuplicates) prefix = '⚠️';

		const fileName = path.basename(testCase.filePath, '.tsx');

		it(`${prefix} [${fileName}] ${testCase.functionName}: ${testCase.comment}`, () => {
			const result = fileResults.get(testCase.filePath);
			expect(result).toBeDefined();
			createDuplicateTestAssertion(testCase, result!.diagnostics, result!.sourceCode, expect);
		});
	});
});
