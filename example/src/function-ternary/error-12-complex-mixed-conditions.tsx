import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;
const hasError = false;
const isLoading = false;

/**
 * ❌ Invalid: Complex mix with multiple conditions
 * @invalidClasses [invalid-loading]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */
export function ComplexMixedConditions() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500',
				isLoading ? 'invalid-loading' : ''
			)}>
			Complex mixed conditions
		</div>
	);
}

// Mock function declarations
