import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-04-extractable-via-variable', () => {
		it("💡 Hint: Variable ternary with 'flex' in both branches (extractable)", async () => {
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
