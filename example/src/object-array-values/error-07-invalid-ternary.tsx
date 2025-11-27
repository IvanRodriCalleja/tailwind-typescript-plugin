import { clsx } from 'clsx';

const isActive = true;

/**
 * ❌ Invalid: Array value with ternary and invalid class
 * @invalidClasses [invalid-active]
 * @validClasses [flex, items-center, bg-gray-500]
 */
export function ObjectArrayValueWithTernaryInvalid() {
	return (
		<div className={clsx({ flex: ['items-center', isActive ? 'invalid-active' : 'bg-gray-500'] })}>
			Invalid ternary
		</div>
	);
}
