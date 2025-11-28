import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Array with ternary expression, all valid
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryAllValid() {
	return (
		<div className={cn(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>Array with ternary</div>
	);
}

