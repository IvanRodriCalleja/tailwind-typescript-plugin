/**
 * ❌ Invalid: Using classNames() function with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function UsingClassNamesFunctionInvalid() {
	return (
		<div className={classNames('flex', 'invalid-class', 'items-center')}>
			Using classNames with invalid
		</div>
	);
}

declare function classNames(...args: string[]): string;
