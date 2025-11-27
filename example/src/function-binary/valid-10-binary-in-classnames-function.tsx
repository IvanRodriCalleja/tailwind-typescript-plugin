// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Binary in classNames() function
 * @validClasses [flex, text-red-500]
 */
export function BinaryInClassNamesFunction() {
	return (
		<div className={classNames('flex', isError && 'text-red-500')}>Binary in classNames()</div>
	);
}

// Mock function declarations
declare function classNames(...args: unknown[]): string;
