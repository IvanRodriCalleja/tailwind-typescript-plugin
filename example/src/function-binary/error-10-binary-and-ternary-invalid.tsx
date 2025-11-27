// Simulate dynamic values that might come from props or state
const isError = false;
const isActive = true;

/**
 * ❌ Invalid: Binary and ternary with invalid classes
 * @invalidClasses [invalid-error, invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function BinaryAndTernaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isError && 'invalid-error',
				isActive ? 'invalid-active' : 'bg-gray-500'
			)}>
			Binary and ternary with invalid
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
