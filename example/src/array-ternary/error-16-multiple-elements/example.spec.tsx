import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('array-ternary', () => {
	describe('error-16-multiple-elements', () => {
		it('❌ should report invalid classes in multiple elements', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-active');
				expect(invalidClasses).toContain('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
