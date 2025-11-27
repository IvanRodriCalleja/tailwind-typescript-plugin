import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	FolderTestCase,
	PluginInstance,
	createConflictTestAssertion,
	parseTestFolder,
	runPluginOnFolder
} from '../test/test-helpers';

describe('E2E Tests - Conflicting Class Detection', () => {
	const testFolder = path.join(__dirname, 'conflicting-classes');
	const testCases = parseTestFolder(testFolder);
	let fileResults: Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>;
	let plugins: PluginInstance[];

	beforeAll(async () => {
		const result = await runPluginOnFolder(testFolder, { utilityFunctions: ['clsx', 'cn'] });
		fileResults = result.results;
		plugins = result.plugins;
	});

	afterAll(() => {
		// Clean up plugins to close file watchers
		plugins.forEach(plugin => plugin.dispose());
	});

	it('should parse test cases from folder', () => {
		expect(testCases.length).toBeGreaterThan(0);
		const conflictCases = testCases.filter(tc => tc.expectedConflictClasses.length > 0);
		const validCases = testCases.filter(
			tc => tc.shouldBeValid && tc.expectedConflictClasses.length === 0
		);
		expect(conflictCases.length).toBeGreaterThan(0);
		expect(validCases.length).toBeGreaterThan(0);
	});

	// Generate a test for each test case automatically
	testCases.forEach((testCase: FolderTestCase) => {
		const hasConflicts = testCase.expectedConflictClasses.length > 0;
		const hasDuplicates = testCase.expectedDuplicateClasses.length > 0;
		const hasInvalid = testCase.expectedInvalidClasses.length > 0;

		let prefix = '✅';
		if (hasConflicts) prefix = '⚠️';
		else if (hasDuplicates) prefix = '⚠️';
		else if (hasInvalid) prefix = '❌';

		const fileName = path.basename(testCase.filePath, '.tsx');

		it(`${prefix} [${fileName}] ${testCase.functionName}: ${testCase.comment}`, () => {
			const result = fileResults.get(testCase.filePath);
			expect(result).toBeDefined();
			createConflictTestAssertion(testCase, result!.diagnostics, result!.sourceCode, expect);
		});
	});
});
