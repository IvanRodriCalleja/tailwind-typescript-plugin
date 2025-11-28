import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;

/**
 * ✅ Valid: Array with binary and ternary combined
 * @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
 */
export function ArrayBinaryAndTernaryValid() {
	return (
		<div
			className={cn(['flex', isError && 'text-red-500', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>
			Binary and ternary in array
		</div>
	);
}

// Mock function declarations
