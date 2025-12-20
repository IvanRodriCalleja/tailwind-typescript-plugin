import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-class-override', () => {
	describe('error-01-class-override-invalid', () => {
		it('❌ error 01 class override invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-override-class');

				expect(invalidClasses).not.toContain('bg-pink-500');
				expect(invalidClasses).not.toContain('hover:bg-pink-700');
			} finally {
				plugin.dispose();
			}
		});
	});
});
