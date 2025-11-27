// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Array with binary expression, all valid
 * @validClasses [flex, text-red-500]
 */
export function ArrayBinaryAllValid() {
	return <div className={cn(['flex', isError && 'text-red-500'])}>Array with binary</div>;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
