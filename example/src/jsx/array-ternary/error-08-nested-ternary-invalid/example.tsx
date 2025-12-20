import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Nested ternary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, bg-green-500, bg-gray-500]
 */

const isActive = true;
const isDisabled = false;

export function ArrayNestedTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'
			])}>
			Nested ternary invalid
		</div>
	);
}
