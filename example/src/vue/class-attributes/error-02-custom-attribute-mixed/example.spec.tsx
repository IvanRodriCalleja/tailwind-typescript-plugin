import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('jsx/class-attributes', () => {
	describe('error-02-custom-attribute-mixed', () => {
		it('should detect multiple invalid classes mixed with valid ones', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(2);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(classNames).toContain('not-a-class');
				expect(classNames).toContain('also-invalid');
			} finally {
				plugin.dispose();
			}
		});
	});
});
