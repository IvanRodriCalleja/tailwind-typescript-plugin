import { clsx as cn } from 'clsx';
import clsx from 'clsx';

/**
 * ✅ Valid: Nested functions with ternary in array
 * @validClasses [flex, bg-blue-500, bg-gray-500, items-center]
 */

const isActive = true;

export function ArrayNestedFunctionsWithTernary() {
	return (
		<div className={clsx('flex', cn([isActive ? 'bg-blue-500' : 'bg-gray-500', 'items-center']))}>
			Nested with ternary
		</div>
	);
}
