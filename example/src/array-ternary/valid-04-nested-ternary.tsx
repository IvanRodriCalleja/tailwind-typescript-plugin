import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Nested ternary expressions in array
 * @validClasses [flex, bg-blue-500, bg-green-500, bg-gray-500]
 */

const isActive = true;
const isDisabled = false;

export function ArrayNestedTernaryValid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'
			])}>
			Nested ternary in array
		</div>
	);
}

