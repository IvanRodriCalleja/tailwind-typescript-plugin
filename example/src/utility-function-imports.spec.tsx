import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	FolderTestCase,
	PluginInstance,
	UtilityFunction,
	createTestAssertion,
	parseTestFolder,
	runPluginOnFile
} from '../test/test-helpers';

describe('E2E Tests - Utility Function Import Verification', () => {
	const testFolder = path.join(__dirname, 'utility-function-imports');
	const testCases = parseTestFolder(testFolder);
	const fileResults = new Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>();
	const plugins: PluginInstance[] = [];

	beforeAll(async () => {
		// Run each test file with its specific utility function configuration
		for (const testCase of testCases) {
			if (!fileResults.has(testCase.filePath)) {
				const result = await runPluginOnFile(testCase.filePath, {
					utilityFunctions: testCase.utilityFunctions as UtilityFunction[]
				});
				fileResults.set(testCase.filePath, {
					diagnostics: result.diagnostics,
					sourceCode: result.sourceCode
				});
				plugins.push(result.plugin);
			}
		}
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
			createTestAssertion(testCase, result!.diagnostics, result!.sourceCode, expect);
		});
	});
});
