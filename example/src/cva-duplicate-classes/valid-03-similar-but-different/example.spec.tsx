import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('valid-03-similar-but-different', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('p-4');
				expect(invalidClasses).not.toContain('pt-2');
				expect(invalidClasses).not.toContain('px-6');
				expect(invalidClasses).not.toContain('py-3');
			} finally {
				plugin.dispose();
			}
		});
	});
});
