import { clsx } from 'clsx';

/**
 * ✅ Valid: Nested arrays as object values
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectNestedArrayValue() {
	return (
		<div className={clsx({ flex: [['items-center', 'justify-center']], 'bg-blue-500': true })}>
			Nested array value
		</div>
	);
}
