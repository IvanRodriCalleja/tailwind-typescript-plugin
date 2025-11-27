// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Nested functions with invalid in object
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ObjectNestedFunctionsInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				cn({ 'items-center': true, 'invalid-class': isActive }),
				'bg-blue-500'
			)}>
			Nested invalid
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
declare function cn(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
