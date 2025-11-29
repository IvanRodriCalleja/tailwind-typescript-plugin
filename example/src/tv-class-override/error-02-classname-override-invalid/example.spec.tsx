import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-class-override', () => {
	describe('error-02-classname-override-invalid', () => {
		it('❌ error 02 classname override invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-classname-override');

				expect(invalidClasses).not.toContain('bg-teal-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
