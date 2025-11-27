// @test-scope-start
const spacingClasses = 'p-4 m-2';
const moreSpacing = 'p-4';

/**
 * ⚠️ Warning: Duplicate via multiple variables
 * @duplicateClasses [p-4, p-4]
 */
export function DuplicateViaMultipleVariables() {
	return <div className={clsx(spacingClasses, moreSpacing)}>Duplicate via multiple variables</div>;
}

declare function clsx(...args: unknown[]): string;
