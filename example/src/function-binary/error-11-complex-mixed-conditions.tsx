// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;
const isDisabled = false;

/**
 * ❌ Invalid: Complex mix with multiple conditions
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ComplexMixedConditions() {
	return (
		<div
			className={clsx(
				'flex',
				isError && 'text-red-500',
				hasWarning && 'bg-yellow-100',
				isDisabled && 'invalid-disabled'
			)}>
			Complex mixed conditions
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
