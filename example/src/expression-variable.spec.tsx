import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	TestCase,
	parseTestFile,
	runPluginOnFile,
	createTestAssertion
} from '../test/test-helpers';

/**
 * E2E Tests for Variable Reference Validation.
 *
 * Variable references are validated by resolving to their declaration.
 * Errors point to the actual class name string in the variable declaration,
 * with a message indicating where the variable is used as className.
 *
 * This uses the standard test assertion helper since errors now point to
 * the string literal positions (not the variable usage positions).
 */
describe('E2E Tests - Expression Variable Reference', () => {
	const testFile = path.join(__dirname, 'expression-variable.tsx');
	const testCases = parseTestFile(testFile);
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
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

	// Generate tests for each test case using the standard helper
	testCases.forEach((testCase: TestCase) => {
		const prefix = testCase.shouldBeValid ? '✅' : '❌';
		it(`${prefix} ${testCase.functionName}: ${testCase.comment}`, () => {
			createTestAssertion(testCase, diagnostics, sourceCode, expect);
		});
	});
});
