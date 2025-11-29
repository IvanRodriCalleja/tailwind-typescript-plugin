import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-variable', () => {
	describe('error-04-array-base-invalid', () => {
		it('❌ error 04 array base invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-tv-base-var');

				expect(invalidClasses).not.toContain('gap-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
