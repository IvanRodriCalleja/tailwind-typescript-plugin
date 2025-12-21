import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-02-simple-ternary-extractable', () => {
		it('💡 Hint: Simple ternary without utility function', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const extractableDiagnostics = getExtractableClassDiagnostics(diagnostics);
				const extractableClasses = getClassNamesFromDiagnostics(extractableDiagnostics, generatedCode);

				expect(extractableClasses).toContain('flex');
				expect(extractableClasses).toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
