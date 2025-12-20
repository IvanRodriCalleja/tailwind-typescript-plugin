import { clsx } from 'clsx';

/**
 * ✅ Valid: Object with array value, all valid
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectArrayValueValid() {
	return <div className={clsx({ flex: ['items-center', 'justify-center'] })}>Array value</div>;
}
