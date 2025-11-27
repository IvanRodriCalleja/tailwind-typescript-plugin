// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;

/**
 * ❌ Invalid: Multiple ternary arguments with invalid classes
 * @invalidClasses [invalid-active, invalid-disabled]
 * @validClasses [flex, bg-gray-500, text-black]
 */
export function MultipleTernaryArgsInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			)}>
			Multiple ternary with invalid
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
