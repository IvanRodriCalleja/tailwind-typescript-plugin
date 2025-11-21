import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	TestCase,
	createTestAssertion,
	parseTestFile,
	runPluginOnFile
} from '../test/test-helpers';

describe('E2E Tests - Tailwind Variants Class Property Override', () => {
	const testFile = path.join(__dirname, 'tv-class-override.tsx');
	const testCases = parseTestFile(testFile);
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
		// Don't pass utility functions - let the type checker determine
		// that myCustomBuilder and buildStyles are not tv-created functions
		const result = await runPluginOnFile(testFile);
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;
	});

	it('should parse test cases from comments', () => {
		expect(testCases.length).toBeGreaterThan(0);
		const validCases = testCases.filter(tc => tc.shouldBeValid);
		const invalidCases = testCases.filter(tc => !tc.shouldBeValid);
		expect(validCases.length).toBeGreaterThan(0);
		expect(invalidCases.length).toBeGreaterThan(0);
	});

	// Generate a test for each test case
	testCases.forEach((testCase: TestCase) => {
		const prefix = testCase.shouldBeValid ? '✅' : '❌';
		it(`${prefix} ${testCase.functionName}: ${testCase.comment}`, () => {
			createTestAssertion(testCase, diagnostics, sourceCode, expect);
		});
	});
});
