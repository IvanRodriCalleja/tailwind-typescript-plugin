import { clsx as cn } from 'clsx';

import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Nested functions with ternary expressions
 * @validClasses [flex, bg-blue-500, bg-gray-500, items-center]
 */
export function NestedFunctionsWithTernary() {
	return (
		<div className={clsx('flex', cn(isActive ? 'bg-blue-500' : 'bg-gray-500', 'items-center'))}>
			Nested functions with ternary
		</div>
	);
}

// Mock function declarations
