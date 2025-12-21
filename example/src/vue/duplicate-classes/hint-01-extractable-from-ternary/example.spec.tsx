import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-01-extractable-from-ternary', () => {
		it('💡 Hint: Class appears in BOTH ternary branches but NOT at root', async () => {
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
