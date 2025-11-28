import clsx from 'clsx';

/**
 * ✅ Valid: Empty string argument
 * @validClasses [flex, items-center]
 */
export function EmptyStringArgument() {
	return <div className={clsx('flex', '', 'items-center')}>Empty string argument</div>;
}

