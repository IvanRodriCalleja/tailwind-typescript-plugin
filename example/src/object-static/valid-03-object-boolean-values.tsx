/**
 * ✅ Valid: Object with boolean values
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectBooleanValues() {
	return (
		<div className={clsx({ flex: true, 'items-center': false, 'justify-center': true })}>
			Boolean values
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
