// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;

/**
 * ✅ Valid: Multiple arguments with ternary expressions, all valid
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
 */
export function MultipleTernaryArgsAllValid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'text-white' : 'text-black'
			)}>
			Multiple ternary arguments
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
