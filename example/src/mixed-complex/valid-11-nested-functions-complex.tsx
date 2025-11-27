/**
 * ✅ Valid: Nested function calls with complex structures
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
import { clsx } from 'clsx';

import { cn } from '../utils';

export function NestedFunctionsComplex() {
	return (
		<div
			className={cn(clsx('flex', { 'items-center': ['justify-center'] }), [
				clsx({ 'bg-blue-500': true }),
				'text-white'
			])}>
			Nested functions
		</div>
	);
}
