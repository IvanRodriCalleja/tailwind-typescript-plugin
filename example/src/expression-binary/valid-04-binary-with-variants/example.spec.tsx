import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('valid-04-binary-with-variants', () => {
		it('✅ Valid: Binary with Tailwind variants', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('md:text-lg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
