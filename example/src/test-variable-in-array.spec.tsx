import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import { runPluginOnFile } from '../test/test-helpers';

/**
 * Test: Variables used inside array expressions
 */
describe('Variables Inside Array Expressions', () => {
	const testFile = path.join(__dirname, 'test-variable-in-array.tsx');
	let diagnostics: ts.Diagnostic[];

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile);
		diagnostics = result.diagnostics;
	});

	it('should NOT report errors for valid variable in array', () => {
		const flexErrors = diagnostics.filter(
			d =>
				typeof d.messageText === 'string' &&
				d.messageText.includes('"flex"') &&
				d.messageText.includes('not a valid')
		);
		expect(flexErrors.length).toBe(0);
	});

	it('should detect invalid-array-var in array', () => {
		const errors = diagnostics.filter(
			d => typeof d.messageText === 'string' && d.messageText.includes('invalid-array-var')
		);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should detect invalid-mixed-array in array', () => {
		const errors = diagnostics.filter(
			d => typeof d.messageText === 'string' && d.messageText.includes('invalid-mixed-array')
		);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should detect invalid-ternary-array in array', () => {
		const errors = diagnostics.filter(
			d => typeof d.messageText === 'string' && d.messageText.includes('invalid-ternary-array')
		);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should detect variables in nested arrays', () => {
		// The nested array should also resolve variables
		const errors = diagnostics.filter(
			d => typeof d.messageText === 'string' && d.messageText.includes('invalid-array-var')
		);
		// invalidClass is used in TestVariableInArrayInvalid, TestMultipleVariablesInArray, TestNestedArrayWithVariable
		expect(errors.length).toBe(3);
	});
});
