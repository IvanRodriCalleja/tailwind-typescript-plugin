import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-class-override', () => {
	describe('error-06-lite-class-override-invalid', () => {
		it('❌ error 06 lite class override invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-lite-override');

				expect(invalidClasses).not.toContain('bg-cyan-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
