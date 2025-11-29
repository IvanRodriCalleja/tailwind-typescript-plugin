import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-binary', () => {
	describe('error-07-binary-or-invalid-class', () => {
		it('❌ Invalid: Binary OR expression with invalid class', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-fallback');
				expect(invalidClassNames).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
