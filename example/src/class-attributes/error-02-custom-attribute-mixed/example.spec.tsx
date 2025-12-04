import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('error-02-custom-attribute-mixed', () => {
		it('❌ Invalid: Custom attribute with mixed valid and invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('not-a-real-class');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
