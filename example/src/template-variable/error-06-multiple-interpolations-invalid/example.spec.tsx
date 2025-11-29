import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-variable', () => {
	describe('error-06-multiple-interpolations-invalid', () => {
		it('❌ Invalid: Multiple interpolations with invalid classes in different positions', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-first');
				expect(invalidClassNames).toContain('invalid-middle');
				expect(invalidClassNames).toContain('invalid-last');
				expect(invalidClassNames).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
