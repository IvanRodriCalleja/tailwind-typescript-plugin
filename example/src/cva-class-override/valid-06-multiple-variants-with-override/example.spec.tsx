import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-class-override', () => {
	describe('valid-06-multiple-variants-with-override', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('bg-indigo-500');
				expect(invalidClasses).not.toContain('hover:bg-indigo-700');
			} finally {
				plugin.dispose();
			}
		});
	});
});
