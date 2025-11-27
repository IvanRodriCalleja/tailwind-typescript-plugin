// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Mix with invalid in both static and ternary
 * @invalidClasses [invalid-static, invalid-ternary]
 * @validClasses [flex, items-center, bg-gray-500]
 */
export function MixedStaticAndTernaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				'invalid-static',
				isActive ? 'invalid-ternary' : 'bg-gray-500',
				'items-center'
			)}>
			Mixed with invalid
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
