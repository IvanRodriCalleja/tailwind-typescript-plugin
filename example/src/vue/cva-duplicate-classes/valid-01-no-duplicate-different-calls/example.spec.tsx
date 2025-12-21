import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('valid-01-no-duplicate-different-calls', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('justify-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
