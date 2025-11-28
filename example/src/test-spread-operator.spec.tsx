import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	FolderTestCase,
	PluginInstance,
	createTestAssertion,
	createDuplicateTestAssertion,
	createConflictTestAssertion,
	parseTestFolder,
	runPluginOnFolder
} from '../test/test-helpers';

/**
 * Test: Spread operator support in arrays and function calls
 */
describe('E2E Tests - Spread Operator Support', () => {
	const testFolder = path.join(__dirname, 'test-spread-operator');
	const testCases = parseTestFolder(testFolder);
	let fileResults: Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>;
	let plugins: PluginInstance[];

	beforeAll(async () => {
		const result = await runPluginOnFolder(testFolder);
		fileResults = result.results;
		plugins = result.plugins;
	});

	afterAll(() => {
		plugins.forEach(plugin => plugin.dispose());
	});

	it('should parse test cases from folder', () => {
		expect(testCases.length).toBeGreaterThan(0);
		const validCases = testCases.filter(tc => tc.shouldBeValid);
		const invalidCases = testCases.filter(tc => !tc.shouldBeValid);
		expect(validCases.length).toBeGreaterThan(0);
		expect(invalidCases.length).toBeGreaterThan(0);
	});

	testCases.forEach((testCase: FolderTestCase) => {
		const prefix = testCase.shouldBeValid ? '✅' : '❌';
		const fileName = path.basename(testCase.filePath, '.tsx');

		it(`${prefix} [${fileName}] ${testCase.functionName}: ${testCase.comment}`, () => {
			const result = fileResults.get(testCase.filePath);
			expect(result).toBeDefined();

			// Use the appropriate assertion function based on expected diagnostics
			if (testCase.expectedDuplicateClasses.length > 0) {
				createDuplicateTestAssertion(testCase, result!.diagnostics, result!.sourceCode, expect);
			} else if (testCase.expectedConflictClasses.length > 0) {
				createConflictTestAssertion(testCase, result!.diagnostics, result!.sourceCode, expect);
			} else {
				createTestAssertion(testCase, result!.diagnostics, result!.sourceCode, expect);
			}
		});
	});
});
