import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-variable', () => {
	describe('error-02-base-variable-mixed', () => {
		it('❌ error 02 base variable mixed', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-tv-mixed-var');

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
