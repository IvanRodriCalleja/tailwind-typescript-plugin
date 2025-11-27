/**
 * ✅ Valid: Nested functions with ternary in array
 * @validClasses [flex, bg-blue-500, bg-gray-500, items-center]
 */

const isActive = true;

export function ArrayNestedFunctionsWithTernary() {
	return (
		<div className={clsx('flex', cn([isActive ? 'bg-blue-500' : 'bg-gray-500', 'items-center']))}>
			Nested with ternary
		</div>
	);
}

declare function cn(...args: unknown[]): string;
declare function clsx(...args: unknown[]): string;
