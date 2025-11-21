/**
 * E2E Test: Array Ternary
 * Context: array (array literal)
 * Pattern: ternary (with conditional expressions)
 *
 * Tests validation of: className={cn(['flex', isActive ? 'class1' : 'class2'])}
 */

// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;
const hasError = false;
const isLoading = false;

// ========================================
// BASIC TERNARY IN ARRAY
// ========================================

/**
 * ✅ Valid: Array with ternary expression, all valid
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ArrayTernaryAllValid() {
	return (
		<div className={cn(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>Array with ternary</div>
	);
}

/**
 * ❌ Invalid: Array with ternary, invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayTernaryInvalidTrue() {
	return (
		<div className={cn(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])}>
			Invalid in true branch
		</div>
	);
}

/**
 * ❌ Invalid: Array with ternary, invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-blue-500]
 */
export function ArrayTernaryInvalidFalse() {
	return (
		<div className={cn(['flex', isActive ? 'bg-blue-500' : 'invalid-inactive'])}>
			Invalid in false branch
		</div>
	);
}

/**
 * ❌ Invalid: Array with ternary, invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 * @validClasses [flex]
 */
export function ArrayTernaryInvalidBoth() {
	return (
		<div className={cn(['flex', isActive ? 'invalid-active' : 'invalid-inactive'])}>
			Invalid in both branches
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-blue-500, font-bold, bg-gray-500]
 */
export function ArrayTernaryMultipleClasses() {
	return (
		<div className={cn(['flex', isActive ? 'bg-blue-500 invalid-class font-bold' : 'bg-gray-500'])}>
			Multiple classes with invalid
		</div>
	);
}

// ========================================
// MULTIPLE TERNARY EXPRESSIONS IN ARRAY
// ========================================

/**
 * ✅ Valid: Multiple ternary expressions in array, all valid
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
 */
export function ArrayMultipleTernaryAllValid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'text-white' : 'text-black'
			])}>
			Multiple ternary in array
		</div>
	);
}

/**
 * ❌ Invalid: Multiple ternary expressions with invalid classes
 * @invalidClasses [invalid-active, invalid-disabled]
 * @validClasses [flex, bg-gray-500, text-black]
 */
export function ArrayMultipleTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			])}>
			Multiple ternary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Mix of valid and invalid ternary in array
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-black]
 */
export function ArrayMultipleTernaryMixed() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			])}>
			Mixed ternary in array
		</div>
	);
}

// ========================================
// MIXED STATIC AND TERNARY IN ARRAY
// ========================================

/**
 * ✅ Valid: Mix of static and ternary in array
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500, font-bold]
 */
export function ArrayMixedStaticTernaryValid() {
	return (
		<div
			className={cn([
				'flex',
				'items-center',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				'font-bold'
			])}>
			Mixed static and ternary
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in both static and ternary
 * @invalidClasses [invalid-static, invalid-ternary]
 * @validClasses [flex, items-center, bg-gray-500]
 */
export function ArrayMixedStaticTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				'invalid-static',
				isActive ? 'invalid-ternary' : 'bg-gray-500',
				'items-center'
			])}>
			Mixed with invalid
		</div>
	);
}

// ========================================
// NESTED TERNARY IN ARRAY
// ========================================

/**
 * ✅ Valid: Nested ternary expressions in array
 * @validClasses [flex, bg-blue-500, bg-green-500, bg-gray-500]
 */
export function ArrayNestedTernaryValid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'
			])}>
			Nested ternary in array
		</div>
	);
}

/**
 * ❌ Invalid: Nested ternary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, bg-green-500, bg-gray-500]
 */
export function ArrayNestedTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'
			])}>
			Nested ternary invalid
		</div>
	);
}

// ========================================
// TERNARY WITH VARIANTS IN ARRAY
// ========================================

/**
 * ✅ Valid: Ternary with Tailwind variants in array
 * @validClasses [flex, hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
 */
export function ArrayTernaryWithVariants() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'
			])}>
			Ternary with variants
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with invalid variant in array
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex, hover:bg-gray-500]
 */
export function ArrayTernaryWithInvalidVariant() {
	return (
		<div className={cn(['flex', isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500'])}>
			Ternary with invalid variant
		</div>
	);
}

// ========================================
// TERNARY WITH ARBITRARY VALUES IN ARRAY
// ========================================

/**
 * ✅ Valid: Ternary with arbitrary values in array
 * @validClasses [flex, h-[50vh], w-[100px], h-[30vh], w-[50px]]
 */
export function ArrayTernaryWithArbitraryValues() {
	return (
		<div className={cn(['flex', isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]'])}>
			Ternary with arbitrary values
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with mix of arbitrary and invalid in array
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh], h-[30vh]]
 */
export function ArrayTernaryWithArbitraryAndInvalid() {
	return (
		<div className={cn(['flex', isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]'])}>
			Ternary with arbitrary and invalid
		</div>
	);
}

// ========================================
// EMPTY STRING BRANCHES IN ARRAY
// ========================================

/**
 * ✅ Valid: Ternary with empty string in false branch
 * @validClasses [flex, bg-blue-500]
 */
export function ArrayTernaryWithEmptyFalse() {
	return <div className={cn(['flex', isActive ? 'bg-blue-500' : ''])}>Empty false branch</div>;
}

/**
 * ✅ Valid: Ternary with empty string in true branch
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayTernaryWithEmptyTrue() {
	return <div className={cn(['flex', isActive ? '' : 'bg-gray-500'])}>Empty true branch</div>;
}

/**
 * ❌ Invalid: Ternary with invalid in non-empty branch
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ArrayTernaryWithEmptyAndInvalid() {
	return <div className={cn(['flex', isActive ? 'invalid-class' : ''])}>Invalid with empty</div>;
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ✅ Valid: Array with ternary and binary combined
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */
export function ArrayTernaryAndBinaryValid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500'
			])}>
			Ternary and binary in array
		</div>
	);
}

/**
 * ❌ Invalid: Array with ternary and binary with invalid
 * @invalidClasses [invalid-active, invalid-error]
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayTernaryAndBinaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				hasError && 'invalid-error'
			])}>
			Ternary and binary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Complex array with multiple conditions
 * @invalidClasses [invalid-loading]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */
export function ArrayComplexConditions() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500',
				isLoading ? 'invalid-loading' : ''
			])}>
			Complex conditions
		</div>
	);
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Ternary in array with clsx()
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ArrayTernaryInClsx() {
	return (
		<div className={clsx(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>
			Ternary in clsx array
		</div>
	);
}

/**
 * ❌ Invalid: Ternary in array with clsx() invalid
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayTernaryInClsxInvalid() {
	return (
		<div className={clsx(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])}>
			Ternary in clsx invalid
		</div>
	);
}

/**
 * ✅ Valid: Ternary in array with classNames()
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ArrayTernaryInClassNames() {
	return (
		<div className={classNames(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>
			Ternary in classNames
		</div>
	);
}

// ========================================
// NESTED FUNCTION CALLS
// ========================================

/**
 * ✅ Valid: Nested functions with ternary in array
 * @validClasses [flex, bg-blue-500, bg-gray-500, items-center]
 */
export function ArrayNestedFunctionsWithTernary() {
	return (
		<div className={clsx('flex', cn([isActive ? 'bg-blue-500' : 'bg-gray-500', 'items-center']))}>
			Nested with ternary
		</div>
	);
}

/**
 * ❌ Invalid: Nested functions with invalid ternary in array
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500, items-center]
 */
export function ArrayNestedFunctionsWithTernaryInvalid() {
	return (
		<div
			className={clsx('flex', cn([isActive ? 'invalid-active' : 'bg-gray-500', 'items-center']))}>
			Nested with invalid
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
export function ArrayTernaryMultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={cn(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])}>
				Invalid in first
			</div>
			<div className={cn(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>Valid in second</div>
			<div className={cn(['flex', isActive ? 'invalid-class' : 'bg-gray-500'])}>
				Invalid in third
			</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing with ternary in array
 * @validClasses [rounded-lg, rounded-sm]
 */
export function ArrayTernarySelfClosingValid() {
	return <img className={cn([isActive ? 'rounded-lg' : 'rounded-sm'])} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing with invalid ternary in array
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function ArrayTernarySelfClosingInvalid() {
	return (
		<img className={cn([isActive ? 'invalid-style' : 'rounded-lg'])} src="test.jpg" alt="test" />
	);
}

// ========================================
// TERNARY WITH BOOLEAN/NULL RESULTS
// ========================================

/**
 * ✅ Valid: Ternary with boolean result in array (ignored)
 * @validClasses [flex, bg-blue-500]
 */
export function ArrayTernaryWithBooleanResult() {
	return <div className={cn(['flex', isActive ? 'bg-blue-500' : false])}>Ternary with boolean</div>;
}

/**
 * ✅ Valid: Ternary with null result in array (ignored)
 * @validClasses [flex, bg-blue-500]
 */
export function ArrayTernaryWithNullResult() {
	return <div className={cn(['flex', isActive ? 'bg-blue-500' : null])}>Ternary with null</div>;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function classNames(...args: (string | string[] | boolean | null | undefined)[]): string;
