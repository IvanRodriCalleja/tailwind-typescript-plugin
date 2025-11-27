/**
 * ✅ Valid: Using classNames() function
 * @validClasses [flex, items-center, justify-center]
 */
export function UsingClassNamesFunction() {
	return (
		<div className={classNames('flex', 'items-center', 'justify-center')}>
			Using classNames function
		</div>
	);
}

declare function classNames(...args: string[]): string;
