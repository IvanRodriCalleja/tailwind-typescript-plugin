import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Function with ternary expression, invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function FunctionTernaryInvalidTrue() {
	return (
		<div className={clsx('flex', isActive ? 'invalid-active' : 'bg-gray-500')}>
			Invalid in true branch
		</div>
	);
}

// Mock function declarations
