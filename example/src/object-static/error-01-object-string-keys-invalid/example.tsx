import clsx from 'clsx';

/**
 * ❌ Invalid: Object with string literal key, invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ObjectStringKeysInvalid() {
	return <div className={clsx({ flex: true, 'invalid-class': true })}>Invalid string key</div>;
}
