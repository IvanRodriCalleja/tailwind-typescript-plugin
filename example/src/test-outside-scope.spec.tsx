import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import { runPluginOnFile } from '../test/test-helpers';

/**
 * Test: Variables defined outside function scope
 *
 * This tests that the plugin correctly validates variables declared at module level
 * (outside function/component scope) when they are used in className.
 */
describe('Variables Outside Function Scope', () => {
	const testFile = path.join(__dirname, 'test-outside-scope.tsx');
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile);
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;
	});

	it('should detect invalid class in module-level variable', () => {
		// Should find error for 'invalid-outside-class'
		const invalidOutsideErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('invalid-outside-class')
		);

		// The variable is used 3 times (TestOutsideScopeInvalid, TestOutsideScopeReuse1, TestOutsideScopeReuse2)
		// But error should point to declaration, so we might get 3 errors (one per usage)
		expect(invalidOutsideErrors.length).toBeGreaterThan(0);

		// Verify error message mentions variable usage
		const firstError = invalidOutsideErrors[0];
		expect(typeof firstError.messageText).toBe('string');
		if (typeof firstError.messageText === 'string') {
			expect(firstError.messageText).toContain('outsideInvalidClass');
			expect(firstError.messageText).toContain('className');
		}
	});

	it('should detect invalid class in mixed module-level variable', () => {
		const mixedErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('invalid-mixed-outside')
		);

		expect(mixedErrors.length).toBeGreaterThan(0);
	});

	it('should detect invalid class in module-level ternary', () => {
		const ternaryErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('invalid-ternary-outside')
		);

		expect(ternaryErrors.length).toBeGreaterThan(0);
	});

	it('should NOT report errors for valid module-level classes', () => {
		const flexErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('"flex"') &&
			     d.messageText.includes('not a valid')
		);

		expect(flexErrors.length).toBe(0);
	});

	it('should point errors to the declaration site, not usage site', () => {
		const invalidOutsideErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('invalid-outside-class')
		);

		expect(invalidOutsideErrors.length).toBeGreaterThan(0);

		// Get the position of the first error
		const firstError = invalidOutsideErrors[0];
		expect(firstError.start).toBeDefined();

		// The error should point to the declaration (line 7 in source)
		// which is "const outsideInvalidClass = 'invalid-outside-class';"
		const errorText = sourceCode.substring(
			firstError.start!,
			firstError.start! + firstError.length!
		);

		// Should extract the actual class name from the string literal
		expect(errorText).toBe('invalid-outside-class');
	});

	it('should report error for each usage of the same invalid variable', () => {
		// outsideInvalidClass is used 3 times
		const invalidOutsideErrors = diagnostics.filter(
			d => typeof d.messageText === 'string' &&
			     d.messageText.includes('invalid-outside-class')
		);

		// Each usage should generate an error pointing to the declaration
		expect(invalidOutsideErrors.length).toBe(3);
	});
});
