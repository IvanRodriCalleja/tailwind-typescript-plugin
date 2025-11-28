import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Function with ternary expression, invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 * @validClasses [flex]
 */
export function FunctionTernaryInvalidBoth() {
	return (
		<div className={clsx('flex', isActive ? 'invalid-active' : 'invalid-inactive')}>
			Invalid in both branches
		</div>
	);
}

// Mock function declarations
