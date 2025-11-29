import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-variable', () => {
	describe('error-10-multiple-elements', () => {
		it('❌ should report invalid classes in multiple elements with template literals', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('bad-class');
				expect(invalidClasses).toContain('another-bad');
			} finally {
				plugin.dispose();
			}
		});
	});
});
