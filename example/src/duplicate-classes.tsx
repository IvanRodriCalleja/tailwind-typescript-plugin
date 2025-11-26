/**
 * E2E Test: Duplicate Class Detection
 * Context: literal (plain string) and expressions
 * Pattern: duplicate (same class appears multiple times)
 *
 * Tests validation of duplicate classes within className attributes.
 * Duplicates should show as WARNINGS (not errors) on the second occurrence.
 */

// ========================================
// SIMPLE DUPLICATES (String Literals)
// ========================================

/**
 * ⚠️ Warning: Same class appears twice
 * @duplicateClasses [flex]
 * First "flex" is valid, second "flex" should show warning
 */
export function SimpleDuplicate() {
	return <div className="flex flex items-center">Simple duplicate</div>;
}

/**
 * ⚠️ Warning: Same class appears three times
 * @duplicateClasses [flex, flex]
 * First "flex" is valid, second and third should show warnings
 */
export function TripleDuplicate() {
	return <div className="flex flex flex items-center">Triple duplicate</div>;
}

/**
 * ⚠️ Warning: Multiple different duplicates
 * @duplicateClasses [flex, items-center]
 * Second occurrence of both classes should show warnings
 */
export function MultipleDuplicates() {
	return <div className="flex items-center flex items-center">Multiple duplicates</div>;
}

/**
 * ⚠️ Warning: Duplicate at the end
 * @duplicateClasses [p-4]
 */
export function DuplicateAtEnd() {
	return <div className="flex items-center p-4 p-4">Duplicate at end</div>;
}

/**
 * ⚠️ Warning: Duplicate in the middle
 * @duplicateClasses [bg-white]
 */
export function DuplicateInMiddle() {
	return <div className="flex bg-white items-center bg-white p-4">Duplicate in middle</div>;
}

// ========================================
// NO DUPLICATES (Valid cases)
// ========================================

/**
 * ✅ Valid: No duplicates - all unique classes
 * @validClasses [flex, items-center, justify-between, p-4, bg-white]
 */
export function NoDuplicates() {
	return <div className="flex items-center justify-between p-4 bg-white">No duplicates</div>;
}

/**
 * ✅ Valid: Similar but different classes
 * These are NOT duplicates as they are different utility classes
 * @validClasses [p-4, pt-4, px-4, py-4]
 */
export function SimilarButDifferent() {
	return <div className="p-4 pt-4 px-4 py-4">Similar but different</div>;
}

/**
 * ✅ Valid: Same class in different elements
 * "flex" appears in two different className attributes - this is NOT a duplicate
 * @validClasses [flex, items-center, justify-center]
 */
export function SameClassDifferentElements() {
	return (
		<div className="flex items-center">
			<span className="flex justify-center">Same class, different elements</span>
		</div>
	);
}

// ========================================
// JSX EXPRESSIONS
// ========================================

/**
 * ⚠️ Warning: Duplicate in JSX expression string
 * @duplicateClasses [flex]
 */
export function DuplicateInExpression() {
	return <div className={'flex flex items-center'}>Duplicate in expression</div>;
}

/**
 * ⚠️ Warning: Duplicate in template literal
 * @duplicateClasses [flex]
 */
export function DuplicateInTemplateLiteral() {
	return <div className={`flex flex items-center`}>Duplicate in template</div>;
}

// ========================================
// UTILITY FUNCTION CALLS
// ========================================

/**
 * ⚠️ Warning: Duplicate in clsx function
 * @duplicateClasses [flex]
 */
export function DuplicateInClsx() {
	return <div className={clsx('flex', 'flex', 'items-center')}>Duplicate in clsx</div>;
}

/**
 * ⚠️ Warning: Duplicate in cn function
 * @duplicateClasses [p-4]
 */
export function DuplicateInCn() {
	return <div className={cn('p-4 p-4 m-2')}>Duplicate in cn</div>;
}

/**
 * ⚠️ Warning: Duplicate across clsx arguments
 * @duplicateClasses [bg-blue-500]
 */
export function DuplicateAcrossArguments() {
	return (
		<div className={clsx('flex bg-blue-500', 'items-center bg-blue-500')}>
			Duplicate across args
		</div>
	);
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ⚠️ Warning: Multiple occurrences with different spacing
 * @duplicateClasses [flex]
 */
export function DuplicateWithSpacing() {
	return <div className="flex   flex    items-center">Duplicate with spacing</div>;
}

/**
 * ✅ Valid: Empty className (no duplicates possible)
 */
export function EmptyClassName() {
	return <div className="">Empty</div>;
}

/**
 * ✅ Valid: Single class (no duplicates possible)
 * @validClasses [flex]
 */
export function SingleClass() {
	return <div className="flex">Single class</div>;
}

// ========================================
// ARRAYS
// ========================================

/**
 * ⚠️ Warning: Duplicate in array literal
 * @duplicateClasses [flex]
 */
export function DuplicateInArray() {
	return <div className={cn(['flex', 'flex', 'items-center'])}>Duplicate in array</div>;
}

/**
 * ⚠️ Warning: Duplicate across array elements
 * @duplicateClasses [bg-blue-500]
 */
export function DuplicateAcrossArrayElements() {
	return (
		<div className={cn(['flex bg-blue-500', 'items-center', 'bg-blue-500'])}>
			Duplicate across array elements
		</div>
	);
}

/**
 * ⚠️ Warning: Duplicate in nested array
 * @duplicateClasses [p-4]
 */
export function DuplicateInNestedArray() {
	return (
		<div
			className={cn([
				['p-4', 'flex'],
				['items-center', 'p-4']
			])}>
			Duplicate in nested array
		</div>
	);
}

// ========================================
// TERNARY EXPRESSIONS
// ========================================

const isActive = true;

/**
 * ⚠️ Warning: Duplicate with ternary - class at ROOT and in BOTH branches
 * @duplicateClasses [flex, flex]
 * The root 'flex' makes the branch 'flex' classes true duplicates
 */
export function DuplicateRootAndTernaryBranches() {
	return (
		<div className={clsx('flex', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>
			Duplicate in ternary (root + branches)
		</div>
	);
}

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

/**
 * 💡 Hint: Multiple extractable classes in ternary
 * @extractableClasses [flex, flex, items-center, items-center]
 * Both 'flex' and 'items-center' appear in both branches (4 hints total)
 */
export function MultipleExtractableClasses() {
	return (
		<div className={isActive ? 'flex items-center p-4' : 'flex items-center m-4'}>
			Multiple extractable classes
		</div>
	);
}

/**
 * ✅ Valid: Class only in ONE ternary branch
 * No issue - 'flex' only appears in the true branch
 */
export function ClassInOneBranchOnly() {
	return (
		<div className={clsx('mt-4', isActive ? 'flex bg-blue-500' : 'bg-gray-500')}>
			Class in one branch only (valid)
		</div>
	);
}

/**
 * ⚠️ Warning: Duplicate WITHIN same ternary branch
 * @duplicateClasses [flex]
 * 'flex' appears twice in the true branch = true duplicate
 */
export function DuplicateWithinSameBranch() {
	return (
		<div className={clsx('mt-4', isActive ? 'flex flex bg-blue-500' : 'bg-gray-500')}>
			Duplicate within same branch
		</div>
	);
}

/**
 * ⚠️ Warning: Duplicate - base class repeated in ternary branch
 * @duplicateClasses [items-center]
 */
export function DuplicateBaseAndTernary() {
	return (
		<div className={cn('flex items-center', isActive ? 'items-center' : 'items-start')}>
			Duplicate base and ternary
		</div>
	);
}

/**
 * ⚠️ Warning: Duplicate in template ternary
 * @duplicateClasses [p-4]
 */
export function DuplicateInTemplateTernary() {
	return (
		<div className={`p-4 ${isActive ? 'p-4 bg-blue-500' : 'bg-gray-500'}`}>
			Duplicate in template ternary
		</div>
	);
}

/**
 * 💡 Hint: Simple ternary without utility function
 * @extractableClasses [flex, flex]
 */
export function SimpleTernaryExtractable() {
	return (
		<div className={isActive ? 'flex bg-blue-500' : 'flex bg-gray-500'}>
			Simple ternary extractable
		</div>
	);
}

// ========================================
// BINARY EXPRESSIONS (&&)
// ========================================

const hasError = true;

/**
 * ⚠️ Warning: Duplicate with binary expression
 * @duplicateClasses [text-red-500]
 */
export function DuplicateWithBinary() {
	return (
		<div className={clsx('flex text-red-500', hasError && 'text-red-500')}>
			Duplicate with binary
		</div>
	);
}

/**
 * ⚠️ Warning: Duplicate in template binary
 * @duplicateClasses [border]
 */
export function DuplicateInTemplateBinary() {
	return (
		<div className={`flex border ${hasError && 'border text-red-500'}`}>
			Duplicate in template binary
		</div>
	);
}

/**
 * ⚠️ Warning: Multiple binary duplicates
 * @duplicateClasses [p-4, m-2]
 */
export function MultipleBinaryDuplicates() {
	return (
		<div className={cn('p-4 m-2', hasError && 'p-4', isActive && 'm-2')}>
			Multiple binary duplicates
		</div>
	);
}

// ========================================
// VARIABLE RESOLUTION
// ========================================

const baseClasses = 'flex items-center';
const duplicateVar = 'flex';

/**
 * ⚠️ Warning: Duplicate via variable - variable contains duplicate of base
 * @duplicateClasses [flex]
 */
export function DuplicateViaVariable() {
	return <div className={cn(baseClasses, duplicateVar)}>Duplicate via variable</div>;
}

const spacingClasses = 'p-4 m-2';
const moreSpacing = 'p-4';

/**
 * ⚠️ Warning: Duplicate via multiple variables
 * @duplicateClasses [p-4]
 */
export function DuplicateViaMultipleVariables() {
	return <div className={clsx(spacingClasses, moreSpacing)}>Duplicate via multiple variables</div>;
}

// ========================================
// VARIABLE WITH CONDITIONAL CONTENT
// ========================================

const dynamicClasses = isActive ? 'flex bg-blue-500' : 'flex bg-gray-500';

/**
 * ⚠️ Warning: Variable contains ternary - root 'flex' + variable's 'flex' = duplicate
 * @duplicateClasses [flex, flex]
 * The variable resolves to a ternary where 'flex' appears in both branches,
 * and there's also a root 'flex' - so both branch 'flex' classes are duplicates.
 */
export function DuplicateViaVariableWithTernary() {
	return <div className={clsx('flex', dynamicClasses)}>Duplicate via variable with ternary</div>;
}

const conditionalStyle = isActive ? 'flex bg-blue-500' : 'flex bg-gray-500';

/**
 * ⚠️ Warning: Variable ternary with 'flex' in both branches (extractable)
 * @extractableClasses [flex, flex]
 * No root 'flex', but variable contains ternary with 'flex' in both branches.
 * Suggests extracting 'flex' outside the conditional in the variable definition.
 */
export function ExtractableViaVariableWithTernary() {
	return (
		<div className={clsx('mt-4', conditionalStyle)}>Extractable via variable with ternary</div>
	);
}

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

// ========================================
// OBJECT SYNTAX
// ========================================

/**
 * ⚠️ Warning: Duplicate in object keys
 * Note: Object syntax uses class names as keys, duplicates can occur with string values
 * @duplicateClasses [flex]
 */
export function DuplicateInObjectWithString() {
	return (
		<div className={clsx('flex', { flex: true, 'items-center': true })}>
			Duplicate in object with string
		</div>
	);
}

// ========================================
// COMBINED WITH INVALID CLASSES
// ========================================

/**
 * ❌⚠️ Both invalid class error AND duplicate warning
 * @invalidClasses [invalidclass]
 * @duplicateClasses [flex]
 * Should show:
 * - Error on "invalidclass" (not a valid Tailwind class)
 * - Warning on second "flex" (duplicate)
 */
export function InvalidAndDuplicate() {
	return <div className="flex invalidclass flex items-center">Invalid and duplicate</div>;
}

// Stub declarations for utility functions used in examples
declare function clsx(...args: unknown[]): string;
declare function cn(...args: unknown[]): string;
