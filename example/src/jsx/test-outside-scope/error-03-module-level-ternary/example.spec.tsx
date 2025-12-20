import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('test-outside-scope', () => {
	describe('error-03-module-level-ternary', () => {
		it('❌ should report invalid-ternary-outside but not bg-blue-500', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-ternary-outside');
				expect(invalidClasses).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
