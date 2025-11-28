import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Binary with arbitrary values in array
 * @validClasses [flex, h-[50vh], w-[100px]]
 */
export function ArrayBinaryWithArbitraryValues() {
	return (
		<div className={cn(['flex', isActive && 'h-[50vh] w-[100px]'])}>
			Binary with arbitrary values
		</div>
	);
}

// Mock function declarations
