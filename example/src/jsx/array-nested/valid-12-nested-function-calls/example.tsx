import { clsx } from 'clsx';

import { cn } from '../utils';

/**
 * ✅ Valid: Nested function calls with nested arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayNestedFunctions() {
	return (
		<div className={cn([clsx([['flex', 'items-center']]), ['justify-center', 'bg-blue-500']])}>
			Nested functions
		</div>
	);
}
