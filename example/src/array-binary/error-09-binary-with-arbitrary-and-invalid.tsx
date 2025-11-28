import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Binary with mix of arbitrary and invalid in array
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh]]
 */
export function ArrayBinaryWithArbitraryAndInvalid() {
	return (
		<div className={cn(['flex', isActive && 'h-[50vh] invalid-size'])}>
			Binary with arbitrary and invalid
		</div>
	);
}

// Mock function declarations
