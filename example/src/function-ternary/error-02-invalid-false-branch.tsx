// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Function with ternary expression, invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-blue-500]
 */
export function FunctionTernaryInvalidFalse() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500' : 'invalid-inactive')}>
			Invalid in false branch
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
