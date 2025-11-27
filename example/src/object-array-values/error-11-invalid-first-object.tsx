import { clsx } from 'clsx';

/**
 * ❌ Invalid: Multiple objects with array values, invalid in first
 * @invalidClasses [invalid-items]
 * @validClasses [flex, justify-center, bg-blue-500, text-white]
 */
export function MultipleObjectsWithArrayValuesInvalidFirst() {
	return (
		<div
			className={clsx(
				{ flex: ['invalid-items', 'justify-center'] },
				{ 'bg-blue-500': ['text-white'] }
			)}>
			Invalid in first
		</div>
	);
}
