// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Mix of object and array
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectMixedWithArray() {
	return (
		<div
			className={clsx(['flex', 'items-center'], {
				'justify-center': true,
				'bg-blue-500': isActive
			})}>
			Mixed with array
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
