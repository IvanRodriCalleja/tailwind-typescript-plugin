import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-04-similar-but-different', () => {
		it('✅ Valid: Similar but different classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('p-4');
				expect(invalidClassNames).not.toContain('pt-4');
				expect(invalidClassNames).not.toContain('px-4');
				expect(invalidClassNames).not.toContain('py-4');
			} finally {
				plugin.dispose();
			}
		});
	});
});
