// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Nested functions with objects
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectNestedFunctions() {
	return (
		<div
			className={clsx(
				'flex',
				cn({ 'items-center': true, 'justify-center': isActive }),
				'bg-blue-500'
			)}>
			Nested with object
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
declare function cn(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
