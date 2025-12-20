import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../../test/folder-test-helpers';

describe('jsx/class-attributes', () => {
	describe('error-03-multiple-custom-with-invalid', () => {
		it('should detect invalid classes across multiple custom attributes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(2);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(classNames).toContain('bad-color');
				expect(classNames).toContain('bad-text');
			} finally {
				plugin.dispose();
			}
		});
	});
});
