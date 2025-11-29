/**
 * ❌ Invalid: Nested function calls with invalid
 * @invalidClasses [invalid-nested-fn]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
import { clsx } from 'clsx';

import { cn } from '../utils';

export function NestedFunctionsComplexInvalid() {
	return (
		<div
			className={cn(clsx('flex', { 'items-center': ['justify-center'] }), [
				clsx({ 'bg-blue-500': true }),
				'invalid-nested-fn'
			])}>
			Invalid nested fn
		</div>
	);
}
