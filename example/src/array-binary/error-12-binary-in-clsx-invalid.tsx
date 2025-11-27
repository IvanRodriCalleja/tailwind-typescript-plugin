// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Binary in array with clsx() invalid
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function ArrayBinaryInClsxInvalid() {
	return <div className={clsx(['flex', isError && 'invalid-error'])}>Binary in clsx invalid</div>;
}

// Mock function declarations
declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
