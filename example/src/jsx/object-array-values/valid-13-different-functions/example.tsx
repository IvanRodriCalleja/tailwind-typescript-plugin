import { clsx } from 'clsx';

import { cn } from '../utils';

/**
 * ✅ Valid: Different utility functions
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectArrayValueDifferentFunctions() {
	return (
		<>
			<div className={clsx({ flex: ['items-center'] })}>clsx</div>
			<div className={cn({ 'justify-center': ['bg-blue-500'] })}>cn</div>
		</>
	);
}
