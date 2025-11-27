/**
 * ✅ Valid: Object key with multiple classes
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectMultipleClassesInKey() {
	return (
		<div className={clsx({ 'flex items-center justify-center': true })}>
			Multiple classes in key
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
