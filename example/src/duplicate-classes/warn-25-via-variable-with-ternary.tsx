import clsx from 'clsx';

const isActive = true;

// @test-scope-start
const dynamicClasses = isActive ? 'flex bg-blue-500' : 'flex bg-gray-500';

/**
 * ⚠️ Warning: Variable contains ternary - root 'flex' + variable's 'flex' = duplicate
 * @duplicateClasses [flex, flex, flex]
 * The variable resolves to a ternary where 'flex' appears in both branches,
 * and there's also a root 'flex' - all three 'flex' occurrences are duplicates.
 */
export function DuplicateViaVariableWithTernary() {
	return <div className={clsx('flex', dynamicClasses)}>Duplicate via variable with ternary</div>;
}

