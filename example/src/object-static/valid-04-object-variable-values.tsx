// Simulate dynamic values that might come from props or state
const isDisabled = false;
const hasError = false;

/**
 * ✅ Valid: Object with variable values
 * @validClasses [flex, text-red-500, bg-gray-100]
 */
export function ObjectVariableValues() {
	return (
		<div className={clsx({ flex: true, 'text-red-500': hasError, 'bg-gray-100': isDisabled })}>
			Variable values
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
