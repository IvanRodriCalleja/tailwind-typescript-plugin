import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('error-11-nested-functions-complex-invalid', () => {
		it('❌ should report invalid-nested-fn in nested function calls', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-nested-fn');
			} finally {
				plugin.dispose();
			}
		});
	});
});
