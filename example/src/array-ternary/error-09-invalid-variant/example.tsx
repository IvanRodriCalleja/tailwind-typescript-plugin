import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Ternary with invalid variant in array
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex, hover:bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryWithInvalidVariant() {
	return (
		<div className={cn(['flex', isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500'])}>
			Ternary with invalid variant
		</div>
	);
}
