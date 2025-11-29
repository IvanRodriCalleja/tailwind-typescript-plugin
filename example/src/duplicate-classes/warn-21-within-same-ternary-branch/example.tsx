import clsx from 'clsx';

const isActive = true;

/**
 * ⚠️ Warning: Duplicate WITHIN same ternary branch
 * @duplicateClasses [flex, flex]
 * 'flex' appears twice in the true branch = true duplicate
 */
export function DuplicateWithinSameBranch() {
	return (
		<div className={clsx('mt-4', isActive ? 'flex flex bg-blue-500' : 'bg-gray-500')}>
			Duplicate within same branch
		</div>
	);
}
