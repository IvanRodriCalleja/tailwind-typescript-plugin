/**
 * ✅ Valid: Ternary in array with clsx()
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryInClsx() {
	return (
		<div className={clsx(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>
			Ternary in clsx array
		</div>
	);
}

declare function clsx(...args: unknown[]): string;
