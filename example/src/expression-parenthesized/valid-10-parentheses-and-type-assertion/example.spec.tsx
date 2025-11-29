import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-parenthesized', () => {
	describe('valid-10-parentheses-and-type-assertion', () => {
		it('✅ Valid: Combination of parentheses and type assertion', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('justify-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
