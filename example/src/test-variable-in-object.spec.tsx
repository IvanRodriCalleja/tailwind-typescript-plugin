import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import { runPluginOnFile } from '../test/test-helpers';

/**
 * Test: Variables used inside object expressions
 */
describe('Variables Inside Object Expressions', () => {
	const testFile = path.join(__dirname, 'test-variable-in-object.tsx');
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile);
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;

		// Debug: print tw-plugin diagnostics
		const twDiagnostics = diagnostics.filter(
			d => (d as any).source === 'tw-plugin'
		);
		console.log('TW diagnostics:', twDiagnostics.map(d => ({
			message: d.messageText,
			start: d.start,
			text: sourceCode.substring(d.start!, d.start! + d.length!)
		})));
	});

	it('should detect invalid class in computed property variable', () => {
		// Filter only tw-plugin errors for invalid-object-var
		const errors = diagnostics.filter(
			d => (d as any).source === 'tw-plugin' &&
			     typeof d.messageText === 'string' &&
			     d.messageText.includes('invalid-object-var')
		);
		expect(errors.length).toBeGreaterThan(0);

		// Verify error message includes variable context
		const firstError = errors[0];
		expect(typeof firstError.messageText).toBe('string');
		if (typeof firstError.messageText === 'string') {
			expect(firstError.messageText).toContain('invalidClass');
			expect(firstError.messageText).toContain('className');
		}
	});

	it('should handle shorthand properties (identifier as class name)', () => {
		// In { flex }, the identifier 'flex' is treated as a class name
		// This should be valid since 'flex' is a valid Tailwind class
		const flexErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('"flex"') &&
			     d.messageText.includes('not a valid')
		);
		expect(flexErrors.length).toBe(0);
	});

	it('should handle string literal keys', () => {
		// 'bg-blue-500' as a key should be validated
		const bgErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('"bg-blue-500"') &&
			     d.messageText.includes('not a valid')
		);
		expect(bgErrors.length).toBe(0);
	});
});
