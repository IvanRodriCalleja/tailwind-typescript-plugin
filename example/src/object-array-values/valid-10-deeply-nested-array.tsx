import { clsx } from 'clsx';

/**
 * ✅ Valid: Deeply nested arrays as values
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectDeeplyNestedArrayValue() {
	return (
		<div className={clsx({ flex: [[['items-center', 'justify-center', 'bg-blue-500']]] })}>
			Deeply nested
		</div>
	);
}
