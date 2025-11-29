import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-static', () => {
	describe('valid-01-base-array', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('border');
				expect(invalidClasses).not.toContain('rounded');
			} finally {
				plugin.dispose();
			}
		});
	});
});
