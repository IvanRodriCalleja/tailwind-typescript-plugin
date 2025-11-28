import clsx from 'clsx';

/**
 * ✅ Valid: Single argument with multiple valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function SingleArgumentMultipleClasses() {
	return (
		<div className={clsx('flex items-center justify-center')}>Multiple classes in one arg</div>
	);
}

