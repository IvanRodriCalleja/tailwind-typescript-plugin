import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-variable', () => {
	describe('error-03-invalid-after-interpolation', () => {
		it('❌ Invalid: Template literal with interpolation, invalid class after interpolation', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-after');
			} finally {
				plugin.dispose();
			}
		});
	});
});
