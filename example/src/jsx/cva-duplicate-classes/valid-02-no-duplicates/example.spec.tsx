import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('valid-02-no-duplicates', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
				expect(invalidClasses).not.toContain('justify-between');
				expect(invalidClasses).not.toContain('text-sm');
				expect(invalidClasses).not.toContain('px-2');
				expect(invalidClasses).not.toContain('py-1');
				expect(invalidClasses).not.toContain('text-lg');
				expect(invalidClasses).not.toContain('px-4');
				expect(invalidClasses).not.toContain('py-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
