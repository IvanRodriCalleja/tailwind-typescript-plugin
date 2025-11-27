/**
 * ❌ Invalid: Object key with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectMultipleClassesInKeyInvalid() {
	return (
		<div className={clsx({ 'flex invalid-class items-center': true })}>Multiple with invalid</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
