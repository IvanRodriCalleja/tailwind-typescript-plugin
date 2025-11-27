// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Mix of static and binary in array
 * @validClasses [flex, items-center, text-red-500, font-bold]
 */
export function ArrayMixedStaticBinaryValid() {
	return (
		<div className={cn(['flex', 'items-center', isError && 'text-red-500', 'font-bold'])}>
			Mixed static and binary
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
