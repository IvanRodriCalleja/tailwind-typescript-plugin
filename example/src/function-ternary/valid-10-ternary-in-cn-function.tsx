import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary in cn() function
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryInCnFunction() {
	return (
		<div className={cn('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>Ternary in cn()</div>
	);
}

// Mock function declarations
