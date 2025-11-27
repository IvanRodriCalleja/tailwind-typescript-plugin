// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Function with ternary expression, all valid classes
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function FunctionTernaryAllValid() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Function with ternary expression
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
