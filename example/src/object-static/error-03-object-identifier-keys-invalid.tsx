/**
 * ❌ Invalid: Object with identifier key that would be invalid
 * Note: Identifier keys can't have hyphens, so this tests single-word invalid classes
 * @invalidClasses [invalidclass]
 * @validClasses [flex]
 */
export function ObjectIdentifierKeysInvalid() {
	return <div className={clsx({ flex: true, invalidclass: true })}>Invalid identifier key</div>;
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
