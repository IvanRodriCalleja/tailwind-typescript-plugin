import { clsx } from 'clsx';

/**
 * ❌ Invalid: Object with array value, invalid class in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectArrayValueInvalid() {
	return <div className={clsx({ flex: ['items-center', 'invalid-class'] })}>Invalid in array</div>;
}
