import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('array-static', () => {
	describe('error-14-multiple-jsx-elements', () => {
		it('❌ should report invalid classes in multiple JSX elements', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-error');
				expect(invalidClasses).toContain('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
