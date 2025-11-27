// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Function with binary expression, invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function FunctionBinaryInvalidClass() {
	return (
		<div className={clsx('flex', isError && 'invalid-error')}>
			Function with invalid class in binary
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
