// Simulate dynamic values that might come from props or state
const isActive = true;
const hasError = false;

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in object
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, items-center, justify-center]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, items-center]
 */
export function ObjectMultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx({ flex: true, 'invalid-error': hasError })}>Invalid in first</div>
			<div className={clsx({ flex: true, 'items-center': true, 'justify-center': isActive })}>
				Valid in second
			</div>
			<div className={clsx({ flex: true, 'items-center': true, 'invalid-class': isActive })}>
				Invalid in third
			</div>
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
