// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Binary with invalid variant in array
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function ArrayBinaryWithInvalidVariant() {
	return (
		<div className={cn(['flex', isActive && 'invalid-variant:bg-blue'])}>
			Binary with invalid variant
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
