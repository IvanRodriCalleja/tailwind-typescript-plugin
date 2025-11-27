// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Binary in cn() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function BinaryInCnFunctionInvalid() {
	return <div className={cn('flex', isError && 'invalid-class')}>Binary in cn() invalid</div>;
}

// Mock function declarations
declare function cn(...args: unknown[]): string;
