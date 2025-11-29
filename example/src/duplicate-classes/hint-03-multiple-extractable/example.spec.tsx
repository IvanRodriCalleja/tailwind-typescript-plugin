import {
	getClassNamesFromDiagnostics,
	getExtractableClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('hint-03-multiple-extractable', () => {
		it('💡 Hint: Multiple extractable classes in ternary', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const extractableDiagnostics = getExtractableClassDiagnostics(diagnostics);
				const extractableClasses = getClassNamesFromDiagnostics(extractableDiagnostics, sourceCode);

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
