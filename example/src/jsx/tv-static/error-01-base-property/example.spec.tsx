import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-static', () => {
	describe('error-01-base-property', () => {
		it('❌ error 01 base property', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-base-class');

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
