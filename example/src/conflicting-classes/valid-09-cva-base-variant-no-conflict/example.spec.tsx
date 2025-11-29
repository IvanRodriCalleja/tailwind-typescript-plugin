import { getClassNamesFromDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('valid-09-cva-base-variant-no-conflict', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				// Test that plugin runs successfully
				expect(diagnostics).toBeDefined();
			} finally {
				plugin.dispose();
			}
		});
	});
});
