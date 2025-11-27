/**
 * ❌ Invalid: Array with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function ArrayWithInvalidVariant() {
	return <div className={cn(['flex', 'invalid-variant:bg-blue'])}>Array with invalid variant</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
