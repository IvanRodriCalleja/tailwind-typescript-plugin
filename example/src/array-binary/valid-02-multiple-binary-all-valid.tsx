// Simulate dynamic values that might come from props or state
const isError = true;
const hasWarning = false;

/**
 * ✅ Valid: Multiple binary expressions in array, all valid
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ArrayMultipleBinaryAllValid() {
	return (
		<div className={cn(['flex', isError && 'text-red-500', hasWarning && 'bg-yellow-100'])}>
			Multiple binary in array
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
