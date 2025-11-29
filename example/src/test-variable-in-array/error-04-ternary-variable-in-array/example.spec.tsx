import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-variable-in-array', () => {
	describe('error-04-ternary-variable-in-array', () => {
		it('❌ error 04 ternary variable in array', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-ternary-array');
			} finally {
				plugin.dispose();
			}
		});
	});
});
