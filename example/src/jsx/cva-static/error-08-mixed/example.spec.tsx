import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('cva-static', () => {
	describe('error-08-mixed', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-base');
				expect(invalidClasses).toContain('invalid-variant');
				expect(invalidClasses).toContain('invalid-compound');

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
