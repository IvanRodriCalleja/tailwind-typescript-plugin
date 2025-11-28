import { clsx as cn } from 'clsx';

import clsx from 'clsx';

/**
 * ❌ Invalid: Nested functions with invalid ternary in array
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500, items-center]
 */

const isActive = true;

export function ArrayNestedFunctionsWithTernaryInvalid() {
	return (
		<div
			className={clsx('flex', cn([isActive ? 'invalid-active' : 'bg-gray-500', 'items-center']))}>
			Nested with invalid
		</div>
	);
}

