/**
 * ✅ Valid: Nested function calls
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedFunctionCalls() {
	return (
		<div className={clsx('flex', cn('items-center', 'justify-center'), 'bg-blue-500')}>
			Nested function calls
		</div>
	);
}

declare function clsx(...args: unknown[]): string;
declare function cn(...args: string[]): string;
