import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Function with binary expression with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, text-red-500, font-bold]
 */
export function FunctionBinaryMultipleClasses() {
	return (
		<div className={clsx('flex', isError && 'text-red-500 invalid-class font-bold')}>
			Binary with multiple classes
		</div>
	);
}

// Mock function declarations
