import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-static', () => {
	describe('error-10-lite-variants', () => {
		it('❌ error 10 lite variants', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-lite-variant');

				expect(invalidClasses).not.toContain('bg-red-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
