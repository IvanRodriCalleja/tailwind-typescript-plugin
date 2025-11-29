import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('valid-03-ternary-with-variants', () => {
		it('✅ Valid: Ternary with Tailwind variants', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('md:text-lg');
				expect(invalidClassNames).not.toContain('hover:bg-gray-500');
				expect(invalidClassNames).not.toContain('md:text-sm');
			} finally {
				plugin.dispose();
			}
		});
	});
});
