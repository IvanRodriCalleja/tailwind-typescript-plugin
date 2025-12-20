import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-02-simple-ternary-extractable', () => {
		it('💡 Hint: Simple ternary without utility function', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const extractableDiagnostics = getExtractableClassDiagnostics(diagnostics);
				const extractableClasses = getClassNamesFromDiagnostics(extractableDiagnostics, sourceCode);

				expect(extractableClasses).toContain('flex');
				expect(extractableClasses).toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
