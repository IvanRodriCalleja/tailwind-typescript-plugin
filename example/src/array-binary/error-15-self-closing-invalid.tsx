// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Self-closing with invalid binary in array
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function ArrayBinarySelfClosingInvalid() {
	return <img className={cn([isActive && 'rounded-lg invalid-style'])} src="test.jpg" alt="test" />;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
