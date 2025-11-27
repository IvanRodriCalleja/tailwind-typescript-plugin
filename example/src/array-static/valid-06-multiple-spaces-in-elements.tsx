/**
 * ✅ Valid: Elements with multiple spaces
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleSpacesInElements() {
	return <div className={cn(['flex  items-center', 'justify-center'])}>Multiple spaces</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
