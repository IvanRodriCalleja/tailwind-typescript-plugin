// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Mix of static strings and binary expressions
 * @validClasses [flex, items-center, text-red-500, font-bold]
 */
export function MixedStaticAndBinaryValid() {
	return (
		<div className={clsx('flex', 'items-center', isError && 'text-red-500', 'font-bold')}>
			Mixed static and binary
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
