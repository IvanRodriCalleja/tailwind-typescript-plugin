import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Binary in array with clsx()
 * @validClasses [flex, text-red-500]
 */
export function ArrayBinaryInClsx() {
	return <div className={clsx(['flex', isError && 'text-red-500'])}>Binary in clsx array</div>;
}

// Mock function declarations
