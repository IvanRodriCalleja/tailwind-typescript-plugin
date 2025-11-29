import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('array-ternary', () => {
	describe('error-17-self-closing-invalid', () => {
		it(`❌ Invalid: Self-closing with invalid ternary in array`, async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-style');
				expect(invalidClassNames).not.toContain('rounded-lg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
