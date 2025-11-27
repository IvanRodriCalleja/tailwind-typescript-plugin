// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Multiple objects, all valid
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function MultipleObjectsAllValid() {
	return (
		<div
			className={clsx(
				{ flex: true, 'items-center': true },
				{ 'justify-center': isActive, 'bg-blue-500': true }
			)}>
			Multiple objects
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
