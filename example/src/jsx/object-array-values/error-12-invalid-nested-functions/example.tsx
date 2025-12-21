import { clsx } from 'clsx';

import { cn } from '../utils';

/**
 * ❌ Invalid: Nested function calls with invalid in object array value
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ObjectArrayValueNestedFunctionsInvalid() {
	return (
		<div className={cn([clsx({ flex: ['items-center', 'invalid-nested'] }), 'bg-blue-500'])}>
			Invalid nested fn
		</div>
	);
}
