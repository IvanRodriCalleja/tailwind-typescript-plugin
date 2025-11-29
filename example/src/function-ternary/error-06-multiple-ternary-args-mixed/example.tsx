import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;

/**
 * ❌ Invalid: Mix of valid and invalid ternary arguments
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-black]
 */
export function MultipleTernaryArgsMixed() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			)}>
			Mixed ternary arguments
		</div>
	);
}

// Mock function declarations
