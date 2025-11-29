import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('utility-function-imports', () => {
	describe('valid-01-imported-from-correct-package', () => {
		it('✅ valid 01 imported from correct package', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
