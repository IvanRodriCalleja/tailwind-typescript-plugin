import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('jsx/class-attributes', () => {
	describe('error-01-custom-attribute-invalid', () => {
		it('should detect invalid class in custom attribute', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(1);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(classNames).toContain('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
