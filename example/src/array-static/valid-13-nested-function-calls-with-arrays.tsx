/**
 * ✅ Valid: Nested function calls with arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedFunctionCallsWithArrays() {
	return (
		<div className={clsx('flex', cn(['items-center', 'justify-center']), 'bg-blue-500')}>
			Nested with arrays
		</div>
	);
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
