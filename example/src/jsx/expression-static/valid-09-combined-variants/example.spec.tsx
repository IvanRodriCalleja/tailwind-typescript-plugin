import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('valid-09-combined-variants', () => {
		it('✅ Valid: Combined variants', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('md:hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('lg:focus:ring-2');
				expect(invalidClassNames).not.toContain('dark:md:text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
