import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('valid-01-no-duplicate-different-calls', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('justify-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
