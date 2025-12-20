import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../../test/folder-test-helpers';

describe('jsx/class-attributes', () => {
	describe('error-02-custom-attribute-mixed', () => {
		it('should detect multiple invalid classes mixed with valid ones', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(2);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(classNames).toContain('not-a-class');
				expect(classNames).toContain('also-invalid');
			} finally {
				plugin.dispose();
			}
		});
	});
});
