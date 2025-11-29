import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with empty string in false branch
 * @validClasses [flex, bg-blue-500]
 */
export function TernaryWithEmptyFalse() {
	return <div className={clsx('flex', isActive ? 'bg-blue-500' : '')}>Empty false branch</div>;
}

// Mock function declarations
