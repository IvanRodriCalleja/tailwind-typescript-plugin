// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with empty string in true branch
 * @validClasses [flex, bg-gray-500]
 */
export function TernaryWithEmptyTrue() {
	return <div className={clsx('flex', isActive ? '' : 'bg-gray-500')}>Empty true branch</div>;
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
