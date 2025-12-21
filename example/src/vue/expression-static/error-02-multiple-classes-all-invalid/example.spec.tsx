import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-static', () => {
	describe('error-02-multiple-classes-all-invalid', () => {
		it('❌ Invalid: All classes are invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('badclass');
				expect(invalidClassNames).toContain('anotherBad');
				expect(invalidClassNames).toContain('wrongClass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
