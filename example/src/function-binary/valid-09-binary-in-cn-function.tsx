// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Binary in cn() function
 * @validClasses [flex, text-red-500]
 */
export function BinaryInCnFunction() {
	return <div className={cn('flex', isError && 'text-red-500')}>Binary in cn()</div>;
}

// Mock function declarations
declare function cn(...args: unknown[]): string;
