// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Binary OR in array with invalid class
 * @invalidClasses [invalid-fallback]
 * @validClasses [flex]
 */
export function ArrayBinaryOrInvalid() {
	return <div className={cn(['flex', isError || 'invalid-fallback'])}>Binary OR invalid</div>;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
