import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('array-static', () => {
	describe('error-03-multiple-elements-all-invalid', () => {
		it('❌ should report invalid classes in multiple elements', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-one');
				expect(invalidClasses).toContain('invalid-two');
				expect(invalidClasses).toContain('invalid-three');
			} finally {
				plugin.dispose();
			}
		});
	});
});
