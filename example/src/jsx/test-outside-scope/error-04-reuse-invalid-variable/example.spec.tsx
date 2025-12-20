import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('test-outside-scope', () => {
	describe('error-04-reuse-invalid-variable', () => {
		it('❌ should report invalid-outside-class in reused variable', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-outside-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
