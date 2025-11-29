import clsx from 'clsx';

/**
 * ✅ Valid: Object key with multiple classes
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectMultipleClassesInKey() {
	return (
		<div className={clsx({ 'flex items-center justify-center': true })}>
			Multiple classes in key
		</div>
	);
}
