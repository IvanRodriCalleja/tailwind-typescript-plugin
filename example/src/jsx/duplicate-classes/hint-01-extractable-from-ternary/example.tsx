import clsx from 'clsx';

const isActive = true;

/**
 * 💡 Hint: Class appears in BOTH ternary branches but NOT at root
 * @extractableClasses [flex, flex]
 * This is NOT a duplicate error - only one branch executes at runtime.
 * But it's a hint to consider extracting 'flex' outside the conditional.
 * Hint appears on BOTH occurrences of 'flex'.
 */
export function ExtractableClassInTernary() {
	return (
		<div className={clsx('mt-4', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>
			Extractable class (hint)
		</div>
	);
}
