// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Function with binary expression, valid class
 * @validClasses [flex, text-red-500]
 */
export function FunctionBinaryAllValid() {
	return (
		<div className={clsx('flex', isError && 'text-red-500')}>Function with binary expression</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
