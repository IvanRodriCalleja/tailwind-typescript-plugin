import clsx from 'clsx';

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid class
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid classes
 * @validClasses {2} [flex, items-center, justify-center]
 * @element {3} Third child with invalid class
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, items-center]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx('flex', 'invalid-error')}>Invalid in first child</div>
			<div className={clsx('flex', 'items-center', 'justify-center')}>Valid in second child</div>
			<div className={clsx('flex', 'items-center', 'invalid-class')}>Invalid in third child</div>
		</div>
	);
}

