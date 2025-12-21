import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-01-unique-classes', () => {
		it('✅ Valid: No duplicates - all unique classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('justify-between');
				expect(invalidClassNames).not.toContain('p-4');
				expect(invalidClassNames).not.toContain('bg-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
