// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px], h-[30vh], w-[50px]]
 */
export function TernaryWithArbitraryValues() {
	return (
		<div className={clsx('flex', isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]')}>
			Ternary with arbitrary values
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
