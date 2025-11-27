/**
 * ❌ Invalid: Array in classNames() with invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ArrayInClassNamesFunctionInvalid() {
	return (
		<div className={classNames(['flex', 'invalid-class', 'items-center'])}>
			Array in classNames() invalid
		</div>
	);
}

declare function classNames(...args: (string | string[] | boolean | null | undefined)[]): string;
