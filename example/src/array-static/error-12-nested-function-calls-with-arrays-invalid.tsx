/**
 * ❌ Invalid: Nested function calls with invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function NestedFunctionCallsWithArraysInvalid() {
	return (
		<div className={clsx('flex', cn(['items-center', 'invalid-class']), 'bg-blue-500')}>
			Nested with invalid
		</div>
	);
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
