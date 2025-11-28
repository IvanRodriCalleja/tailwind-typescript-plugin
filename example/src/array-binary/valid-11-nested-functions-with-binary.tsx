import { clsx as cn } from 'clsx';

import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Nested functions with binary in array
 * @validClasses [flex, text-red-500, items-center]
 */
export function ArrayNestedFunctionsWithBinary() {
	return (
		<div className={clsx('flex', cn([isError && 'text-red-500', 'items-center']))}>
			Nested with binary
		</div>
	);
}

// Mock function declarations
