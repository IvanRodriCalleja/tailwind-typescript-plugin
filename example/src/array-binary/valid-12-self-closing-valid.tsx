// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Self-closing with binary in array
 * @validClasses [rounded-lg, shadow-md]
 */
export function ArrayBinarySelfClosingValid() {
	return <img className={cn([isActive && 'rounded-lg shadow-md'])} src="test.jpg" alt="test" />;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
