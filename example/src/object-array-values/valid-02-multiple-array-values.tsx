import { clsx } from 'clsx';

/**
 * ✅ Valid: Multiple properties with array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function ObjectMultipleArrayValues() {
	return (
		<div
			className={clsx({ flex: ['items-center', 'justify-center'], 'bg-blue-500': ['text-white'] })}>
			Multiple arrays
		</div>
	);
}
