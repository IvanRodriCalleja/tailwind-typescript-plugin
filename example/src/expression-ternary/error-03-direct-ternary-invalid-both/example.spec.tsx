import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('error-03-direct-ternary-invalid-both', () => {
		it('❌ Invalid: Direct ternary with invalid in both branches', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-active');
				expect(invalidClassNames).toContain('invalid-inactive');
			} finally {
				plugin.dispose();
			}
		});
	});
});
