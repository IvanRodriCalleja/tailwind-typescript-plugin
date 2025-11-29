import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-variable', () => {
	describe('error-07-slot-variable-invalid', () => {
		it('❌ error 07 slot variable invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-tv-base-var');
			} finally {
				plugin.dispose();
			}
		});
	});
});
