import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-parenthesized', () => {
	describe('valid-08-parenthesized-with-clsx', () => {
		it('✅ Valid: Parenthesized with clsx', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
