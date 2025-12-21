import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-03-multiple-extractable', () => {
		it('💡 Hint: Multiple extractable classes in ternary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const extractableDiagnostics = getExtractableClassDiagnostics(diagnostics);
				const extractableClasses = getClassNamesFromDiagnostics(extractableDiagnostics, generatedCode);

				expect(extractableClasses).toContain('flex');
				expect(extractableClasses).toContain('flex');
				expect(extractableClasses).toContain('items-center');
				expect(extractableClasses).toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
