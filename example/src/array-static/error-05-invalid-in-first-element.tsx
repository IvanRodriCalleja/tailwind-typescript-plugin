/**
 * ❌ Invalid: Invalid in first element
 * @invalidClasses [invalid-first]
 * @validClasses [items-center, justify-center]
 */
export function InvalidInFirstElement() {
	return (
		<div className={cn(['invalid-first', 'items-center', 'justify-center'])}>Invalid first</div>
	);
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
