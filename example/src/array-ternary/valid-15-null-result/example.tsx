import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Ternary with null result in array (ignored)
 * @validClasses [flex, bg-blue-500]
 */

const isActive = true;

export function ArrayTernaryWithNullResult() {
	return <div className={cn(['flex', isActive ? 'bg-blue-500' : null])}>Ternary with null</div>;
}
