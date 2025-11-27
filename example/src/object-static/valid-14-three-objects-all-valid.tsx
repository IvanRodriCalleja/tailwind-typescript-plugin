// Simulate dynamic values that might come from props or state
const isActive = true;
const hasError = false;

/**
 * ✅ Valid: Three objects, all valid
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function ThreeObjectsAllValid() {
	return (
		<div
			className={clsx(
				{ flex: true },
				{ 'items-center': true, 'justify-center': isActive },
				{ 'bg-blue-500': true, 'text-white': true, 'font-bold': hasError }
			)}>
			Three objects
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
