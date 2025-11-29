import { clsx } from 'clsx';

/**
 * ❌ Invalid: Multiple objects with array values, invalid in second
 * @invalidClasses [invalid-text]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function MultipleObjectsWithArrayValuesInvalidSecond() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': ['invalid-text'] }
			)}>
			Invalid in second
		</div>
	);
}
