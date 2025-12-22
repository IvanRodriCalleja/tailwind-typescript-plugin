import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] object-static', () => {
	describe('error-02-object-string-keys-mixed', () => {
		it('❌ Invalid: Object with mix of valid and invalid string keys', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-center');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-start');
			} finally {
				plugin.dispose();
			}
		});
	});
});
