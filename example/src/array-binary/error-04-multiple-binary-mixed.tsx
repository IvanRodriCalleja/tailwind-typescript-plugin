// Simulate dynamic values that might come from props or state
const isError = true;
const hasWarning = false;

/**
 * ❌ Invalid: Mix of valid and invalid binary in array
 * @invalidClasses [invalid-warning]
 * @validClasses [flex, text-red-500]
 */
export function ArrayMultipleBinaryMixed() {
	return (
		<div className={cn(['flex', isError && 'text-red-500', hasWarning && 'invalid-warning'])}>
			Mixed binary in array
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
