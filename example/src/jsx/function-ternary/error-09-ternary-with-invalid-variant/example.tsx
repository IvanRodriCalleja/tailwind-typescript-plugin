import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex, hover:bg-gray-500]
 */
export function TernaryWithInvalidVariant() {
	return (
		<div className={clsx('flex', isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500')}>
			Ternary with invalid variant
		</div>
	);
}

// Mock function declarations
