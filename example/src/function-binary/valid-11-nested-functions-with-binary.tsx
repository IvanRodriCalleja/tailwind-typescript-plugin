import { clsx as cn } from 'clsx';

import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Nested functions with binary expressions
 * @validClasses [flex, text-red-500, items-center]
 */
export function NestedFunctionsWithBinary() {
	return (
		<div className={clsx('flex', cn(isError && 'text-red-500', 'items-center'))}>
			Nested functions with binary
		</div>
	);
}

// Mock function declarations
