// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary in classNames() function
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryInClassNamesFunction() {
	return (
		<div className={classNames('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Ternary in classNames()
		</div>
	);
}

// Mock function declarations
declare function classNames(...args: unknown[]): string;
