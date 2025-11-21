/**
 * E2E Test: Function Ternary
 * Context: function (function call)
 * Pattern: ternary (with conditional expressions)
 *
 * Tests validation of: className={clsx('flex', isActive ? 'class1' : 'class2')}
 */

// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;
const hasError = false;
const isLoading = false;

// ========================================
// BASIC TERNARY EXPRESSION
// ========================================

/**
 * ✅ Valid: Function with ternary expression, all valid classes
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function FunctionTernaryAllValid() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Function with ternary expression
		</div>
	);
}

/**
 * ❌ Invalid: Function with ternary expression, invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function FunctionTernaryInvalidTrue() {
	return (
		<div className={clsx('flex', isActive ? 'invalid-active' : 'bg-gray-500')}>
			Invalid in true branch
		</div>
	);
}

/**
 * ❌ Invalid: Function with ternary expression, invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-blue-500]
 */
export function FunctionTernaryInvalidFalse() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500' : 'invalid-inactive')}>
			Invalid in false branch
		</div>
	);
}

/**
 * ❌ Invalid: Function with ternary expression, invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 * @validClasses [flex]
 */
export function FunctionTernaryInvalidBoth() {
	return (
		<div className={clsx('flex', isActive ? 'invalid-active' : 'invalid-inactive')}>
			Invalid in both branches
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with multiple classes, one invalid in true branch
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-blue-500, font-bold, bg-gray-500]
 */
export function FunctionTernaryMultipleClasses() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500 invalid-class font-bold' : 'bg-gray-500')}>
			Multiple classes with invalid
		</div>
	);
}

// ========================================
// MULTIPLE ARGUMENTS WITH TERNARY
// ========================================

/**
 * ✅ Valid: Multiple arguments with ternary expressions, all valid
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
 */
export function MultipleTernaryArgsAllValid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'text-white' : 'text-black'
			)}>
			Multiple ternary arguments
		</div>
	);
}

/**
 * ❌ Invalid: Multiple ternary arguments with invalid classes
 * @invalidClasses [invalid-active, invalid-disabled]
 * @validClasses [flex, bg-gray-500, text-black]
 */
export function MultipleTernaryArgsInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			)}>
			Multiple ternary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Mix of valid and invalid ternary arguments
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-black]
 */
export function MultipleTernaryArgsMixed() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			)}>
			Mixed ternary arguments
		</div>
	);
}

// ========================================
// MIXED STATIC AND TERNARY
// ========================================

/**
 * ✅ Valid: Mix of static strings and ternary expressions
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500, font-bold]
 */
export function MixedStaticAndTernaryValid() {
	return (
		<div
			className={clsx(
				'flex',
				'items-center',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				'font-bold'
			)}>
			Mixed static and ternary
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in both static and ternary
 * @invalidClasses [invalid-static, invalid-ternary]
 * @validClasses [flex, items-center, bg-gray-500]
 */
export function MixedStaticAndTernaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				'invalid-static',
				isActive ? 'invalid-ternary' : 'bg-gray-500',
				'items-center'
			)}>
			Mixed with invalid
		</div>
	);
}

// ========================================
// NESTED TERNARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Nested ternary expressions
 * @validClasses [flex, bg-blue-500, bg-green-500, bg-gray-500]
 */
export function NestedTernaryValid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'
			)}>
			Nested ternary
		</div>
	);
}

/**
 * ❌ Invalid: Nested ternary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, bg-green-500, bg-gray-500]
 */
export function NestedTernaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'
			)}>
			Nested ternary invalid
		</div>
	);
}

// ========================================
// TERNARY WITH VARIANTS
// ========================================

/**
 * ✅ Valid: Ternary with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
 */
export function TernaryWithVariants() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'
			)}>
			Ternary with variants
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex, hover:bg-gray-500]
 */
export function TernaryWithInvalidVariant() {
	return (
		<div className={clsx('flex', isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500')}>
			Ternary with invalid variant
		</div>
	);
}

// ========================================
// TERNARY WITH ARBITRARY VALUES
// ========================================

/**
 * ✅ Valid: Ternary with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px], h-[30vh], w-[50px]]
 */
export function TernaryWithArbitraryValues() {
	return (
		<div className={clsx('flex', isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]')}>
			Ternary with arbitrary values
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh], h-[30vh]]
 */
export function TernaryWithArbitraryAndInvalid() {
	return (
		<div className={clsx('flex', isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]')}>
			Ternary with arbitrary and invalid
		</div>
	);
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ✅ Valid: Ternary and binary combined in function
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */
export function TernaryAndBinaryValid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500'
			)}>
			Ternary and binary in function
		</div>
	);
}

/**
 * ❌ Invalid: Ternary and binary with invalid classes
 * @invalidClasses [invalid-active, invalid-error]
 * @validClasses [flex, bg-gray-500]
 */
export function TernaryAndBinaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				hasError && 'invalid-error'
			)}>
			Ternary and binary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Complex mix with multiple conditions
 * @invalidClasses [invalid-loading]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */
export function ComplexMixedConditions() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500',
				isLoading ? 'invalid-loading' : ''
			)}>
			Complex mixed conditions
		</div>
	);
}

// ========================================
// EMPTY STRING BRANCHES
// ========================================

/**
 * ✅ Valid: Ternary with empty string in false branch
 * @validClasses [flex, bg-blue-500]
 */
export function TernaryWithEmptyFalse() {
	return <div className={clsx('flex', isActive ? 'bg-blue-500' : '')}>Empty false branch</div>;
}

/**
 * ✅ Valid: Ternary with empty string in true branch
 * @validClasses [flex, bg-gray-500]
 */
export function TernaryWithEmptyTrue() {
	return <div className={clsx('flex', isActive ? '' : 'bg-gray-500')}>Empty true branch</div>;
}

/**
 * ❌ Invalid: Ternary with invalid in non-empty branch
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function TernaryWithEmptyAndInvalid() {
	return <div className={clsx('flex', isActive ? 'invalid-class' : '')}>Invalid with empty</div>;
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Ternary in cn() function
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryInCnFunction() {
	return (
		<div className={cn('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>Ternary in cn()</div>
	);
}

/**
 * ❌ Invalid: Ternary in cn() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-gray-500]
 */
export function TernaryInCnFunctionInvalid() {
	return (
		<div className={cn('flex', isActive ? 'invalid-class' : 'bg-gray-500')}>
			Ternary in cn() invalid
		</div>
	);
}

/**
 * ✅ Valid: Ternary in classNames() function
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryInClassNamesFunction() {
	return (
		<div className={classNames('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Ternary in classNames()
		</div>
	);
}

// ========================================
// NESTED FUNCTION CALLS WITH TERNARY
// ========================================

/**
 * ✅ Valid: Nested functions with ternary expressions
 * @validClasses [flex, bg-blue-500, bg-gray-500, items-center]
 */
export function NestedFunctionsWithTernary() {
	return (
		<div className={clsx('flex', cn(isActive ? 'bg-blue-500' : 'bg-gray-500', 'items-center'))}>
			Nested functions with ternary
		</div>
	);
}

/**
 * ❌ Invalid: Nested functions with invalid in ternary
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500, items-center]
 */
export function NestedFunctionsWithTernaryInvalid() {
	return (
		<div className={clsx('flex', cn(isActive ? 'invalid-active' : 'bg-gray-500', 'items-center'))}>
			Nested with invalid ternary
		</div>
	);
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in ternary
 * @invalidClasses {1} [invalid-active]
 * @validClasses {1} [flex, bg-gray-500]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, bg-blue-500, bg-gray-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, bg-gray-500]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx('flex', isActive ? 'invalid-active' : 'bg-gray-500')}>
				Invalid in first child
			</div>
			<div className={clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
				Valid in second child
			</div>
			<div className={clsx('flex', isActive ? 'invalid-class' : 'bg-gray-500')}>
				Invalid in third child
			</div>
		</div>
	);
}

// ========================================
// TERNARY WITH BOOLEAN RESULTS
// ========================================

/**
 * ✅ Valid: Ternary that might resolve to boolean (ignored)
 * @validClasses [flex, bg-blue-500]
 */
export function TernaryWithBooleanResult() {
	return <div className={clsx('flex', isActive ? 'bg-blue-500' : false)}>Ternary with boolean</div>;
}

/**
 * ✅ Valid: Ternary with null/undefined (ignored)
 * @validClasses [flex, bg-blue-500]
 */
export function TernaryWithNullResult() {
	return <div className={clsx('flex', isActive ? 'bg-blue-500' : null)}>Ternary with null</div>;
}

// Mock function declarations
declare function clsx(...args: (string | boolean | null | undefined)[]): string;
declare function cn(...args: (string | boolean | null | undefined)[]): string;
declare function classNames(...args: (string | boolean | null | undefined)[]): string;
