import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('utility-function-imports', () => {
	describe('error-03-simple-string-invalid', () => {
		it('❌ error 03 simple string invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('bad-class');

				expect(invalidClasses).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
