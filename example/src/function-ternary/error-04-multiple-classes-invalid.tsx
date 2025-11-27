// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary with multiple classes, one invalid in true branch
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-blue-500, font-bold, bg-gray-500]
 */
export function FunctionTernaryMultipleClasses() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500 invalid-class font-bold' : 'bg-gray-500')}>
			Multiple classes with invalid
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
