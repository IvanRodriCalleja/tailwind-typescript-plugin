// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Function with OR binary expression, invalid class
 * @invalidClasses [invalid-fallback]
 * @validClasses [flex]
 */
export function FunctionBinaryOrInvalid() {
	return <div className={clsx('flex', isError || 'invalid-fallback')}>OR with invalid class</div>;
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
