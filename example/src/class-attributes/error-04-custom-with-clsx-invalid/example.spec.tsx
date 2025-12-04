import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('error-04-custom-with-clsx-invalid', () => {
		it('❌ Invalid: Custom attribute with clsx containing invalid class', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('not-valid-class');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
