import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;
const hasWarning = false;
const isDisabled = false;

/**
 * ❌ Invalid: Complex array with multiple conditions
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ArrayComplexConditions() {
	return (
		<div
			className={cn([
				'flex',
				isError && 'text-red-500',
				hasWarning && 'bg-yellow-100',
				isDisabled && 'invalid-disabled'
			])}>
			Complex conditions in array
		</div>
	);
}

// Mock function declarations
