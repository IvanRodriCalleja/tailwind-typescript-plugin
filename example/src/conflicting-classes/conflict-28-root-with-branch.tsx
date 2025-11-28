import clsx from 'clsx';

/**
 * ⚠️ Warning: Root class conflicts with branch class
 * @conflictClasses [text-left, text-center]
 */
export function RootConflictWithBranch() {
	const isActive = true;
	return (
		<div className={clsx('text-left', isActive && 'text-center')}>Root conflicts with branch</div>
	);
}

