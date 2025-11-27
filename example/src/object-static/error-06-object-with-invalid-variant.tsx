// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Object with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function ObjectWithInvalidVariant() {
	return (
		<div className={clsx({ flex: true, 'invalid-variant:bg-blue': isActive })}>Invalid variant</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
