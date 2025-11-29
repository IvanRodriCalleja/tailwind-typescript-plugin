import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('error-02-multiple-classes-all-invalid', () => {
		it('❌ Invalid: All classes are invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('badclass');
				expect(invalidClassNames).toContain('anotherBad');
				expect(invalidClassNames).toContain('wrongClass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
