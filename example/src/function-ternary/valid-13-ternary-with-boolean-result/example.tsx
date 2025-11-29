import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary that might resolve to boolean (ignored)
 * @validClasses [flex, bg-blue-500]
 */
export function TernaryWithBooleanResult() {
	return <div className={clsx('flex', isActive ? 'bg-blue-500' : false)}>Ternary with boolean</div>;
}

// Mock function declarations
