/**
 * ❌ Invalid: Multiple objects mixed nesting with invalid
 * @invalidClasses [invalid-font]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, p-4]
 */
import { clsx } from 'clsx';

const isActive = true;

export function MultipleObjectsMixedNestingInvalid() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': [{ 'text-white': true, 'invalid-font': isActive }] },
				'p-4'
			)}>
			Invalid multiple objects
		</div>
	);
}
