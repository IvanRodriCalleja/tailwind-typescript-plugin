/**
 * ✅ Valid: Mix of ternary, objects, and arrays
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500, justify-center, text-white]
 */
import { clsx } from 'clsx';

const isActive = true;

export function MixedTernaryObjectsArrays() {
	return (
		<div
			className={clsx(
				isActive ? 'flex' : 'grid',
				{ 'items-center': true, 'bg-blue-500': isActive, 'bg-gray-500': !isActive },
				['justify-center', 'text-white']
			)}>
			Mixed ternary objects arrays
		</div>
	);
}
