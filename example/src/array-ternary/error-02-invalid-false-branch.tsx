/**
 * ❌ Invalid: Array with ternary, invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-blue-500]
 */

const isActive = true;

export function ArrayTernaryInvalidFalse() {
	return (
		<div className={cn(['flex', isActive ? 'bg-blue-500' : 'invalid-inactive'])}>
			Invalid in false branch
		</div>
	);
}

declare function cn(...args: unknown[]): string;
