/**
 * ✅ Valid: Ternary with empty string in false branch
 * @validClasses [flex, bg-blue-500]
 */

const isActive = true;

export function ArrayTernaryWithEmptyFalse() {
	return <div className={cn(['flex', isActive ? 'bg-blue-500' : ''])}>Empty false branch</div>;
}

declare function cn(...args: unknown[]): string;
