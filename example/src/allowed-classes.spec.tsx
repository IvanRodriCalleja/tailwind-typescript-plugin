import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	FolderTestCase,
	PluginInstance,
	createTestAssertion,
	parseTestFolder,
	runPluginOnFolder
} from '../test/test-helpers';

describe('E2E Tests - Allowed Classes Configuration', () => {
	const testFolder = path.join(__dirname, 'allowed-classes');
	const testCases = parseTestFolder(testFolder);
	let fileResults: Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>;
	let plugins: PluginInstance[];

	beforeAll(async () => {
		// Configure allowed classes as specified in the test file header
		const result = await runPluginOnFolder(testFolder, {
			allowedClasses: ['custom-button', 'app-header', 'project-card']
		});
		fileResults = result.results;
		plugins = result.plugins;
	});

	afterAll(() => {
		// Clean up plugins to close file watchers
		plugins.forEach(plugin => plugin.dispose());
	});

	it('should parse test cases from folder', () => {
		expect(testCases.length).toBeGreaterThan(0);
		const validCases = testCases.filter(tc => tc.shouldBeValid);
		const invalidCases = testCases.filter(tc => !tc.shouldBeValid);
		expect(validCases.length).toBeGreaterThan(0);
		expect(invalidCases.length).toBeGreaterThan(0);
	});

	// Generate a test for each test case
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
