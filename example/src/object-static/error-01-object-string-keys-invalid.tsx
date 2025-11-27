/**
 * ❌ Invalid: Object with string literal key, invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ObjectStringKeysInvalid() {
	return <div className={clsx({ flex: true, 'invalid-class': true })}>Invalid string key</div>;
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
