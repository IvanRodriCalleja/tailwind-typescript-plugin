import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-static', () => {
	describe('error-09-lite-base', () => {
		it('❌ error 09 lite base', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-lite-class');

				expect(invalidClasses).not.toContain('font-bold');
				expect(invalidClasses).not.toContain('text-blue-600');
			} finally {
				plugin.dispose();
			}
		});
	});
});
