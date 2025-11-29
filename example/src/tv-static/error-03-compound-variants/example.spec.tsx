import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-static', () => {
	describe('error-03-compound-variants', () => {
		it('❌ error 03 compound variants', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-compound-class');

				expect(invalidClasses).not.toContain('font-bold');
			} finally {
				plugin.dispose();
			}
		});
	});
});
