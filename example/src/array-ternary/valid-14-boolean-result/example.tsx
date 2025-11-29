import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Ternary with boolean result in array (ignored)
 * @validClasses [flex, bg-blue-500]
 */

const isActive = true;

export function ArrayTernaryWithBooleanResult() {
	return <div className={cn(['flex', isActive ? 'bg-blue-500' : false])}>Ternary with boolean</div>;
}
