import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

// Mock function declaration

/**
 * ✅ Valid: Ternary in function call wrapper
 * Note: This is a function pattern, not pure expression
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryWithFunctionWrapper() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Ternary in function
		</div>
	);
}
