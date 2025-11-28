import clsx from 'clsx';

const isActive = true;

// @test-scope-start
const conditionalOneBranch = isActive ? 'flex bg-blue-500' : 'bg-gray-500';

/**
 * ✅ Valid: Variable ternary with 'flex' in only ONE branch
 * No duplicate - 'flex' only appears in the true branch of the variable.
 */
export function ValidVariableWithTernaryOneBranch() {
	return (
		<div className={clsx('mt-4', conditionalOneBranch)}>
			Valid variable with ternary (one branch)
		</div>
	);
}

