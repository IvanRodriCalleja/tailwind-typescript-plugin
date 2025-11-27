/**
 * ✅ Valid: Multiple objects with mixed nested structures
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, p-4]
 */
import { clsx } from 'clsx';

const isActive = true;

export function MultipleObjectsMixedNesting() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': [{ 'text-white': true, 'font-bold': isActive }] },
				'p-4'
			)}>
			Multiple objects mixed
		</div>
	);
}
