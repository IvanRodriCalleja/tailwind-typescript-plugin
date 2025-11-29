import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with null/undefined (ignored)
 * @validClasses [flex, bg-blue-500]
 */
export function TernaryWithNullResult() {
	return <div className={clsx('flex', isActive ? 'bg-blue-500' : null)}>Ternary with null</div>;
}

// Mock function declarations
