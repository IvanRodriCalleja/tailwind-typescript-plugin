/**
 * ❌ Invalid: Array with ternary, invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 * @validClasses [flex]
 */

const isActive = true;

export function ArrayTernaryInvalidBoth() {
	return (
		<div className={cn(['flex', isActive ? 'invalid-active' : 'invalid-inactive'])}>
			Invalid in both branches
		</div>
	);
}

declare function cn(...args: unknown[]): string;
