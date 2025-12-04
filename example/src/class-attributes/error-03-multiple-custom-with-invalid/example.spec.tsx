import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('error-03-multiple-custom-with-invalid', () => {
		it('❌ Invalid: Multiple custom attributes with invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('fake-text');
				expect(invalidClasses).toContain('invalid-bg');
				expect(invalidClasses).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
