import { clsx } from 'clsx';

import { cn } from '../utils';

/**
 * ❌ Invalid: Nested function calls with nested arrays and invalid
 * @invalidClasses [invalid-nested-fn]
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayNestedFunctionsInvalid() {
	return (
		<div
			className={cn([clsx([['flex', 'invalid-nested-fn']]), ['items-center', 'justify-center']])}>
			Invalid nested fn
		</div>
	);
}
