import { clsx } from 'clsx';

import { cn } from '../utils';

/**
 * ✅ Valid: Nested function calls with object array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectArrayValueNestedFunctions() {
	return (
		<div className={cn([clsx({ flex: ['items-center', 'justify-center'] }), 'bg-blue-500'])}>
			Nested functions
		</div>
	);
}
