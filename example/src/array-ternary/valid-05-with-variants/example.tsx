import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Ternary with Tailwind variants in array
 * @validClasses [flex, hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
 */

const isActive = true;

export function ArrayTernaryWithVariants() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'
			])}>
			Ternary with variants
		</div>
	);
}
