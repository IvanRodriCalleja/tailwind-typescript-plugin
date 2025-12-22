import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-static', () => {
	describe('valid-07-responsive-variants', () => {
		it('✅ Valid: Responsive variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('sm:flex');
				expect(invalidClassNames).not.toContain('md:grid');
				expect(invalidClassNames).not.toContain('lg:grid-cols-3');
				expect(invalidClassNames).not.toContain('xl:grid-cols-4');
			} finally {
				plugin.dispose();
			}
		});
	});
});
