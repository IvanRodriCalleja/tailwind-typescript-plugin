import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-static', () => {
	describe('error-06-compound-variants', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-compound-class');

				expect(invalidClasses).not.toContain('hover:bg-blue-600');
			} finally {
				plugin.dispose();
			}
		});
	});
});
