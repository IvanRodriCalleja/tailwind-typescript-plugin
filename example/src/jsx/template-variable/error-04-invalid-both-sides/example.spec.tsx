import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('template-variable', () => {
	describe('error-04-invalid-both-sides', () => {
		it('❌ Invalid: Template literal with interpolation, invalid classes on both sides', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-before');
				expect(invalidClassNames).toContain('invalid-after');
			} finally {
				plugin.dispose();
			}
		});
	});
});
