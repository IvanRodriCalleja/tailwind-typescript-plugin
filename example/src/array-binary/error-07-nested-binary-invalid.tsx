// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;

/**
 * ❌ Invalid: Nested binary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex]
 */
export function ArrayNestedBinaryInvalid() {
	return (
		<div className={cn(['flex', isError && isActive && 'invalid-nested'])}>
			Nested binary invalid
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
