// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;

/**
 * ✅ Valid: Nested binary expressions in array
 * @validClasses [flex, text-red-500, font-bold]
 */
export function ArrayNestedBinaryValid() {
	return (
		<div className={cn(['flex', isError && isActive && 'text-red-500 font-bold'])}>
			Nested binary in array
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
