import { clsx } from 'clsx';

const hasError = false;

/**
 * ✅ Valid: Array value with binary expressions
 * @validClasses [flex, items-center, text-red-500]
 */
export function ObjectArrayValueWithBinary() {
	return (
		<div className={clsx({ flex: ['items-center', hasError && 'text-red-500'] })}>
			Array with binary
		</div>
	);
}
