// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in binary
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, text-red-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx('flex', isError && 'invalid-error')}>Invalid in first child</div>
			<div className={clsx('flex', isError && 'text-red-500')}>Valid in second child</div>
			<div className={clsx('flex', isError && 'invalid-class')}>Invalid in third child</div>
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
