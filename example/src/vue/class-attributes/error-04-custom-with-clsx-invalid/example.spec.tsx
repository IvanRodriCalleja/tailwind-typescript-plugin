import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('jsx/class-attributes', () => {
	describe('error-04-custom-with-clsx-invalid', () => {
		it('should detect invalid class in custom attribute with clsx', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(1);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(classNames).toContain('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
