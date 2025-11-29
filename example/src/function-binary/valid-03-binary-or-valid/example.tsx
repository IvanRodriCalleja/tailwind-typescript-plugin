import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Function with OR binary expression
 * @validClasses [flex, bg-gray-500]
 */
export function FunctionBinaryOrValid() {
	return <div className={clsx('flex', isError || 'bg-gray-500')}>Function with OR expression</div>;
}

// Mock function declarations
