import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary in cn() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-gray-500]
 */
export function TernaryInCnFunctionInvalid() {
	return (
		<div className={cn('flex', isActive ? 'invalid-class' : 'bg-gray-500')}>
			Ternary in cn() invalid
		</div>
	);
}

// Mock function declarations
