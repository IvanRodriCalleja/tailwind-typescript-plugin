import { clsx as cn } from 'clsx';
import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Nested functions with invalid in binary
 * @invalidClasses [invalid-error]
 * @validClasses [flex, items-center]
 */
export function NestedFunctionsWithBinaryInvalid() {
	return (
		<div className={clsx('flex', cn(isError && 'invalid-error', 'items-center'))}>
			Nested with invalid binary
		</div>
	);
}

// Mock function declarations
