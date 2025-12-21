import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-class-override', () => {
	describe('error-07-lite-classname-override-invalid', () => {
		it('❌ error 07 lite classname override invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-lite-classname');

				expect(invalidClasses).not.toContain('bg-orange-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
