// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Binary with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, text-red-500, font-bold]
 */
export function ArrayBinaryMultipleClasses() {
	return (
		<div className={cn(['flex', isError && 'text-red-500 invalid-class font-bold'])}>
			Binary with multiple classes
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
