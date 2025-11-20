import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';
import { TestCase, createTestAssertion, parseTestFile, runPluginOnFile } from '../test/test-helpers';

describe('E2E Tests - Direct Binary Expressions', () => {
	const testFile = path.join(__dirname, 'expression-binary.tsx');
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

	testCases.forEach((testCase: TestCase) => {
		const prefix = testCase.shouldBeValid ? '✅' : '❌';
		it(`${prefix} ${testCase.functionName}: ${testCase.comment}`, () => {
			createTestAssertion(testCase, diagnostics, sourceCode, expect);
		});
	});
});
