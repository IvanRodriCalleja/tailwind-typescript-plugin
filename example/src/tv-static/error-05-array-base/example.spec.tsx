import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-static', () => {
	describe('error-05-array-base', () => {
		it('❌ error 05 array base', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-array-class');

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
