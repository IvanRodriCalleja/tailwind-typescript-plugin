// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;

/**
 * ❌ Invalid: Nested ternary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, bg-green-500, bg-gray-500]
 */
export function NestedTernaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'
			)}>
			Nested ternary invalid
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
