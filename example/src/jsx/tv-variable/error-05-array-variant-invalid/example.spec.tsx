import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-variable', () => {
	describe('error-05-array-variant-invalid', () => {
		it('❌ error 05 array variant invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-tv-variant-var');

				expect(invalidClasses).not.toContain('text-sm');
			} finally {
				plugin.dispose();
			}
		});
	});
});
