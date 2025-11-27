/**
 * ❌ Invalid: Array in clsx() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ArrayInClsxFunctionInvalid() {
	return (
		<div className={clsx(['flex', 'invalid-class', 'items-center'])}>Array in clsx() invalid</div>
	);
}

declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
