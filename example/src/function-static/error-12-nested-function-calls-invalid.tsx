/**
 * ❌ Invalid: Nested function calls with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function NestedFunctionCallsInvalid() {
	return (
		<div className={clsx('flex', cn('items-center', 'invalid-class'), 'bg-blue-500')}>
			Nested with invalid
		</div>
	);
}

declare function clsx(...args: unknown[]): string;
declare function cn(...args: string[]): string;
