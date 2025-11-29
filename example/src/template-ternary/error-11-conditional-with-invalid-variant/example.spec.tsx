import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-ternary', () => {
	describe('error-11-conditional-with-invalid-variant', () => {
		it('❌ Invalid: Conditional with invalid variant', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalidvariant:bg-blue-500');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('hover:bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
