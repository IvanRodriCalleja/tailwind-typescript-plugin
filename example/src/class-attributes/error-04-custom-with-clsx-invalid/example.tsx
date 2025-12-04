import clsx from 'clsx';

/**
 * ❌ Invalid: Custom attribute with clsx containing invalid class
 * Tests that validation works with utility functions in custom attributes
 * @validClasses [flex, items-center]
 * @invalidClasses [not-valid-class]
 */
export function CustomWithClsxInvalid() {
	return (
		<div customStyles={clsx('flex', 'not-valid-class', 'items-center')}>
			Custom attribute with clsx containing invalid class
		</div>
	);
}
