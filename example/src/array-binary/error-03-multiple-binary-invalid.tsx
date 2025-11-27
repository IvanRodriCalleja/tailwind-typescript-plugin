// Simulate dynamic values that might come from props or state
const isError = true;
const hasWarning = false;

/**
 * ❌ Invalid: Multiple binary expressions with invalid classes
 * @invalidClasses [invalid-error, invalid-warning]
 * @validClasses [flex]
 */
export function ArrayMultipleBinaryInvalid() {
	return (
		<div className={cn(['flex', isError && 'invalid-error', hasWarning && 'invalid-warning'])}>
			Multiple binary with invalid
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
