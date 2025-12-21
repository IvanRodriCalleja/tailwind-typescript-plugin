import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-static', () => {
	describe('valid-06-state-variants', () => {
		it('✅ Valid: Classes with variants (hover, focus, etc.)', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('focus:ring-2');
				expect(invalidClassNames).not.toContain('active:scale-95');
			} finally {
				plugin.dispose();
			}
		});
	});
});
