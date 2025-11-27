/**
 * ✅ Valid: Array with static strings in function
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ArrayWithStaticStrings() {
	return (
		<div className={cn('flex', ['items-center', 'justify-center'], 'bg-blue-500')}>
			Array with static
		</div>
	);
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
