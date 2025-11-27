// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Mix with invalid in both static and binary
 * @invalidClasses [invalid-static, invalid-binary]
 * @validClasses [flex, items-center]
 */
export function ArrayMixedStaticBinaryInvalid() {
	return (
		<div className={cn(['flex', 'invalid-static', isError && 'invalid-binary', 'items-center'])}>
			Mixed with invalid
		</div>
	);
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
