/**
 * ✅ Valid: Array with empty string element
 * @validClasses [flex, items-center]
 */
export function ArrayWithEmptyString() {
	return <div className={cn(['flex', '', 'items-center'])}>Array with empty string</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
