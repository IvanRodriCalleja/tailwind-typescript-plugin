import { clsx } from 'clsx';

/**
 * ✅ Valid: Multiple objects with array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function MultipleObjectsWithArrayValues() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': ['text-white', 'font-bold'] }
			)}>
			Multiple objects with arrays
		</div>
	);
}
