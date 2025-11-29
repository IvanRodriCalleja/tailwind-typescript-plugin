import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('array-binary', () => {
	describe('error-01-invalid', () => {
		it(`❌ Invalid: Array with binary expression, invalid class`, async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-error');
				expect(invalidClassNames).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
