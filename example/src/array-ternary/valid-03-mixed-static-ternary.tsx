import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Mix of static and ternary in array
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500, font-bold]
 */

const isActive = true;

export function ArrayMixedStaticTernaryValid() {
	return (
		<div
			className={cn([
				'flex',
				'items-center',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				'font-bold'
			])}>
			Mixed static and ternary
		</div>
	);
}

