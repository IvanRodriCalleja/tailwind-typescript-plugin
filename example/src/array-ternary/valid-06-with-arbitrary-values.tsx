/**
 * ✅ Valid: Ternary with arbitrary values in array
 * @validClasses [flex, h-[50vh], w-[100px], h-[30vh], w-[50px]]
 */

const isActive = true;

export function ArrayTernaryWithArbitraryValues() {
	return (
		<div className={cn(['flex', isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]'])}>
			Ternary with arbitrary values
		</div>
	);
}

declare function cn(...args: unknown[]): string;
