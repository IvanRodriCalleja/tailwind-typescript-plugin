// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Object with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], w-[100px]]
 */
export function ObjectWithArbitraryAndInvalid() {
	return (
		<div className={clsx({ 'h-[50vh]': true, 'invalid-size': true, 'w-[100px]': isActive })}>
			Arbitrary and invalid
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
