/**
 * ❌ Invalid: Array with ternary, invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryInvalidTrue() {
	return (
		<div className={cn(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])}>
			Invalid in true branch
		</div>
	);
}

declare function cn(...args: unknown[]): string;
