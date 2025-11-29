import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Binary OR in array with valid class
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayBinaryOrValid() {
	return <div className={cn(['flex', isError || 'bg-gray-500'])}>Binary OR in array</div>;
}

// Mock function declarations
