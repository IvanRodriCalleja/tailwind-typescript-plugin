import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Ternary with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-blue-500, font-bold, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryMultipleClasses() {
	return (
		<div className={cn(['flex', isActive ? 'bg-blue-500 invalid-class font-bold' : 'bg-gray-500'])}>
			Multiple classes with invalid
		</div>
	);
}

