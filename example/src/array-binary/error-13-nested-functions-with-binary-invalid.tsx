import { clsx as cn } from 'clsx';

import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Nested functions with invalid binary in array
 * @invalidClasses [invalid-error]
 * @validClasses [flex, items-center]
 */
export function ArrayNestedFunctionsWithBinaryInvalid() {
	return (
		<div className={clsx('flex', cn([isError && 'invalid-error', 'items-center']))}>
			Nested with invalid
		</div>
	);
}

// Mock function declarations
