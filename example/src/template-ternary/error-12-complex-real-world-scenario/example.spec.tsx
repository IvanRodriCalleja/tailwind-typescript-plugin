import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-ternary', () => {
	describe('error-12-complex-real-world-scenario', () => {
		it('❌ Invalid: Complex example with static, dynamic, and conditional classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

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
