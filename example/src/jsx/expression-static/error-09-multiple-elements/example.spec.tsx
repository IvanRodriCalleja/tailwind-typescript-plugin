import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('error-09-multiple-elements', () => {
		it('❌ should report invalid classes in multiple elements', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('validclass');
				expect(invalidClasses).toContain('badclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
