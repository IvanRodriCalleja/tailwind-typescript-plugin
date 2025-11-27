// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Array with binary expression, invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function ArrayBinaryInvalid() {
	return <div className={cn(['flex', isError && 'invalid-error'])}>Array with invalid binary</div>;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
