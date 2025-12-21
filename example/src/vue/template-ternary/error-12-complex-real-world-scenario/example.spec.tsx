import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('template-ternary', () => {
	describe('error-12-complex-real-world-scenario', () => {
		it('❌ Invalid: Complex example with static, dynamic, and conditional classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-class');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('justify-between');
				expect(invalidClassNames).not.toContain('p-4');
				expect(invalidClassNames).not.toContain('bg-blue-500');
				expect(invalidClassNames).not.toContain('text-white');
				expect(invalidClassNames).not.toContain('bg-gray-200');
				expect(invalidClassNames).not.toContain('text-gray-800');
				expect(invalidClassNames).not.toContain('rounded-lg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
