import clsx from 'clsx';

/**
 * ⚠️ Warning: Conflict in clsx arguments
 * @conflictClasses [flex, block]
 */
export function ConflictInClsx() {
	return <div className={clsx('flex', 'block', 'items-center')}>Conflict in clsx</div>;
}

