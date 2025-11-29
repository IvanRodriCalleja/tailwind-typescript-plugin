import clsx from 'clsx';

const isActive = true;

/**
 * ⚠️ Warning: Duplicate with ternary - class at ROOT and in BOTH branches
 * @duplicateClasses [flex, flex, flex]
 * The root 'flex' and both branch 'flex' classes are all duplicates
 */
export function DuplicateRootAndTernaryBranches() {
	return (
		<div className={clsx('flex', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>
			Duplicate in ternary (root + branches)
		</div>
	);
}
