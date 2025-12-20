import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Binary in function call wrapper
 * Note: This is a function pattern, not pure expression
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithFunctionWrapper() {
	return <div className={clsx('flex', isError && 'text-red-500')}>Binary in function</div>;
}

// Mock function declaration
