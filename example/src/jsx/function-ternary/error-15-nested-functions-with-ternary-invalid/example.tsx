import { clsx as cn } from 'clsx';
import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Nested functions with invalid in ternary
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500, items-center]
 */
export function NestedFunctionsWithTernaryInvalid() {
	return (
		<div className={clsx('flex', cn(isActive ? 'invalid-active' : 'bg-gray-500', 'items-center'))}>
			Nested with invalid ternary
		</div>
	);
}

// Mock function declarations
