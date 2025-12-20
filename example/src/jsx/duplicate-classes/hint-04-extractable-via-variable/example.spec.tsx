import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-04-extractable-via-variable', () => {
		it("💡 Hint: Variable ternary with 'flex' in both branches (extractable)", async () => {
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
