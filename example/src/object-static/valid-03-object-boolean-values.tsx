import clsx from 'clsx';

/**
 * ✅ Valid: Object with boolean values
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectBooleanValues() {
	return (
		<div className={clsx({ flex: true, 'items-center': false, 'justify-center': true })}>
			Boolean values
		</div>
	);
}

