// Simulate dynamic values that might come from props or state
const isError = false;
const isActive = true;

/**
 * ✅ Valid: Binary and ternary combined in function
 * @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
 */
export function BinaryAndTernaryValid() {
	return (
		<div
			className={clsx('flex', isError && 'text-red-500', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Binary and ternary in function
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
