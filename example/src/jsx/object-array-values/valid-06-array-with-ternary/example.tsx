import { clsx } from 'clsx';

const isActive = true;

/**
 * ✅ Valid: Array value with ternary expressions
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500]
 */
export function ObjectArrayValueWithTernary() {
	return (
		<div className={clsx({ flex: ['items-center', isActive ? 'bg-blue-500' : 'bg-gray-500'] })}>
			Array with ternary
		</div>
	);
}
