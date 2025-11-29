import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-class-override', () => {
	describe('error-04-all-invalid-classes', () => {
		it('❌ error 04 all invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('completely-invalid');
				expect(invalidClasses).toContain('another-invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
