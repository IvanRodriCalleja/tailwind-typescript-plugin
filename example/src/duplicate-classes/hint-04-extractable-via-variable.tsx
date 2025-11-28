import clsx from 'clsx';

const isActive = true;

// @test-scope-start
const conditionalStyle = isActive ? 'flex bg-blue-500' : 'flex bg-gray-500';

/**
 * 💡 Hint: Variable ternary with 'flex' in both branches (extractable)
 * @extractableClasses [flex, flex]
 * No root 'flex', but variable contains ternary with 'flex' in both branches.
 * Suggests extracting 'flex' outside the conditional in the variable definition.
 */
export function ExtractableViaVariableWithTernary() {
	return (
		<div className={clsx('mt-4', conditionalStyle)}>Extractable via variable with ternary</div>
	);
}

