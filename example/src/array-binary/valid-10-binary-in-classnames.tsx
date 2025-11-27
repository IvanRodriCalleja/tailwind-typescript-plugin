// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Binary in array with classNames()
 * @validClasses [flex, text-red-500]
 */
export function ArrayBinaryInClassNames() {
	return (
		<div className={classNames(['flex', isError && 'text-red-500'])}>Binary in classNames</div>
	);
}

// Mock function declarations
declare function classNames(...args: (string | string[] | boolean | null | undefined)[]): string;
