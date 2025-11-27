// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Self-closing with object
 * @validClasses [w-full, h-auto, rounded-lg]
 */
export function ObjectSelfClosingValid() {
	return (
		<img
			className={clsx({ 'w-full': true, 'h-auto': true, 'rounded-lg': isActive })}
			src="test.jpg"
			alt="test"
		/>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
