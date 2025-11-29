/**
 * ✅ Valid: Another custom function
 * @utilityFunctions [buildStyles]
 * @validClasses [flex, items-center]
 */
export function AnotherCustomFunction() {
	return <div className={buildStyles('flex', 'items-center')}>Another custom function</div>;
}

declare function buildStyles(...args: string[]): string;
