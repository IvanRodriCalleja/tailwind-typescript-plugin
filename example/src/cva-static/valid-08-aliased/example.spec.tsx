import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-static', () => {
	describe('valid-08-aliased', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
				expect(invalidClasses).not.toContain('gap-2');
				expect(invalidClasses).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
