/**
 * ✅ Valid: Nested arrays
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrays() {
	return <div className={cn([cn(['flex', 'items-center']), 'justify-center'])}>Nested arrays</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
