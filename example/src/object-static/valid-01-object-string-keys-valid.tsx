/**
 * ✅ Valid: Object with string literal keys, all valid
 * @validClasses [flex, items-center]
 */
export function ObjectStringKeysValid() {
	return <div className={clsx({ flex: true, 'items-center': true })}>Object with string keys</div>;
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
