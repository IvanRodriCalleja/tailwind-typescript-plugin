import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('object-static', () => {
	describe('error-02-object-string-keys-mixed', () => {
		it('❌ Invalid: Object with mix of valid and invalid string keys', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-center');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-start');
			} finally {
				plugin.dispose();
			}
		});
	});
});
