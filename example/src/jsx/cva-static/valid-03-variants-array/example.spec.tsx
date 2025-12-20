import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('cva-static', () => {
	describe('valid-03-variants-array', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('bg-blue-500');
				expect(invalidClasses).not.toContain('text-white');
				expect(invalidClasses).not.toContain('border-transparent');
				expect(invalidClasses).not.toContain('bg-white');
				expect(invalidClasses).not.toContain('text-gray-800');
			} finally {
				plugin.dispose();
			}
		});
	});
});
