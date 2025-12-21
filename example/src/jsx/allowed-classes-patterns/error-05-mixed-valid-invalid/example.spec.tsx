import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-05-mixed-valid-invalid', () => {
		it(`❌ Invalid: Mix of valid patterns and invalid class`, async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('not-allowed');
				expect(invalidClassNames).not.toContain('custom-header');
				expect(invalidClassNames).not.toContain('close-icon');
			} finally {
				plugin.dispose();
			}
		});
	});
});
