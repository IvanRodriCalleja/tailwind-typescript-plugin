import { clsx } from 'clsx';

/**
 * ✅ Valid: Mix of boolean and array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function ObjectMixedBooleanAndArray() {
	return (
		<div
			className={clsx({
				flex: true,
				'items-center': ['justify-center', 'bg-blue-500'],
				'text-white': true
			})}>
			Mixed types
		</div>
	);
}
