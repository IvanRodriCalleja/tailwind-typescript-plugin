import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	FolderTestCase,
	PluginInstance,
	createTestAssertion,
	parseTestFolder,
	runPluginOnFolder
} from '../test/test-helpers';

describe('E2E Tests - JSX Expression String Literal', () => {
	const testFolder = path.join(__dirname, 'expression-static');
	const testCases = parseTestFolder(testFolder);
	let folderResults: Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>;
	let plugins: PluginInstance[];

	beforeAll(async () => {
		const result = await runPluginOnFolder(testFolder);
		folderResults = result.results;
		plugins = result.plugins;
	});

	afterAll(() => {
		plugins.forEach(plugin => plugin.dispose());
	});

	it('should parse test cases from comments', () => {
		expect(testCases.length).toBeGreaterThan(0);
		const validCases = testCases.filter(tc => tc.shouldBeValid);
		const invalidCases = testCases.filter(tc => !tc.shouldBeValid);
		expect(validCases.length).toBeGreaterThan(0);
		expect(invalidCases.length).toBeGreaterThan(0);
	});

	// Generate a test for each test case
	testCases.forEach((testCase: FolderTestCase) => {
		const prefix = testCase.shouldBeValid ? '✅' : '❌';
		it(`${prefix} ${testCase.functionName}: ${testCase.comment}`, () => {
			const result = folderResults.get(testCase.filePath);
			expect(result).toBeDefined();
			if (result) {
				createTestAssertion(testCase, result.diagnostics, result.sourceCode, expect);
			}
		});
	});
});
