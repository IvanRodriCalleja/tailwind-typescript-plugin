import { clsx } from 'clsx';

/**
 * ✅ Valid: Empty array as value
 * @validClasses [flex]
 */
export function ObjectEmptyArrayValue() {
	return <div className={clsx({ flex: [] })}>Empty array value</div>;
}
