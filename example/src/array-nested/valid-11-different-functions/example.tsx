import { clsx } from 'clsx';

import { cn } from '../utils';

/**
 * ✅ Valid: Nested arrays in different utility functions
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayDifferentFunctions() {
	return (
		<>
			<div className={clsx([['flex', 'items-center']])}>clsx nested</div>
			<div className={cn([['justify-center']])}>cn nested</div>
		</>
	);
}
