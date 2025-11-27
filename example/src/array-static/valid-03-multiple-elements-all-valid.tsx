/**
 * ✅ Valid: Multiple elements with valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleElementsAllValid() {
	return (
		<div className={cn(['flex', 'items-center', 'justify-center'])}>Multiple valid elements</div>
	);
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
