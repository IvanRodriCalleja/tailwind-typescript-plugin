/**
 * ✅ Valid: Object with identifier keys, all valid
 * @validClasses [flex, items-center]
 */
export function ObjectIdentifierKeysValid() {
	return <div className={clsx({ flex: true, 'items-center': true })}>Identifier keys</div>;
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
