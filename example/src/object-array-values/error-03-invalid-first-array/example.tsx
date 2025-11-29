import { clsx } from 'clsx';

/**
 * ❌ Invalid: Multiple properties with array values, invalid in first
 * @invalidClasses [invalid-flex]
 * @validClasses [items-center, bg-blue-500, text-white]
 */
export function ObjectMultipleArrayValuesInvalidFirst() {
	return (
		<div
			className={clsx({ flex: ['invalid-flex', 'items-center'], 'bg-blue-500': ['text-white'] })}>
			Invalid in first
		</div>
	);
}
