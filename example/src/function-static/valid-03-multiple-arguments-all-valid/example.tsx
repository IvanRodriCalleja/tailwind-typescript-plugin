import clsx from 'clsx';

/**
 * ✅ Valid: Multiple arguments with valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleArgumentsAllValid() {
	return (
		<div className={clsx('flex', 'items-center', 'justify-center')}>Multiple valid arguments</div>
	);
}
