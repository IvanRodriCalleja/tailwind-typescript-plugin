import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-static', () => {
	describe('error-04-slots', () => {
		it('❌ error 04 slots', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-slot-class');

				expect(invalidClasses).not.toContain('mr-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
