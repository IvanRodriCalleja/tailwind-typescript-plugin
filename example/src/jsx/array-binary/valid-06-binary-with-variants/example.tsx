import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Binary with Tailwind variants in array
 * @validClasses [flex, hover:bg-blue-500, md:text-lg]
 */
export function ArrayBinaryWithVariants() {
	return (
		<div className={cn(['flex', isActive && 'hover:bg-blue-500 md:text-lg'])}>
			Binary with variants
		</div>
	);
}

// Mock function declarations
