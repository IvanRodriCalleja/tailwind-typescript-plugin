// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary with invalid in non-empty branch
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function TernaryWithEmptyAndInvalid() {
	return <div className={clsx('flex', isActive ? 'invalid-class' : '')}>Invalid with empty</div>;
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
