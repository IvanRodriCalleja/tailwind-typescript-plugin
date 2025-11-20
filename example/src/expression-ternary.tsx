/**
 * E2E Test: Expression Ternary
 * Context: expression (direct JSX expression)
 * Pattern: ternary (with conditional expressions)
 *
 * Tests validation of: className={isActive ? 'class1' : 'class2'}
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
 * ✅ Valid: Direct ternary expression with all valid classes
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function DirectTernaryAllValid() {
	return <div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Direct ternary expression</div>;
}

/**
 * ❌ Invalid: Direct ternary with invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [bg-gray-500]
 */
export function DirectTernaryInvalidTrue() {
	return <div className={isActive ? 'invalid-active' : 'bg-gray-500'}>Invalid in true branch</div>;
}

/**
 * ❌ Invalid: Direct ternary with invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [bg-blue-500]
 */
export function DirectTernaryInvalidFalse() {
	return (
		<div className={isActive ? 'bg-blue-500' : 'invalid-inactive'}>Invalid in false branch</div>
	);
}

/**
 * ❌ Invalid: Direct ternary with invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 */
export function DirectTernaryInvalidBoth() {
	return (
		<div className={isActive ? 'invalid-active' : 'invalid-inactive'}>Invalid in both branches</div>
	);
}

/**
 * ❌ Invalid: Ternary with multiple classes, one invalid in true branch
 * @invalidClasses [invalid-class]
 * @validClasses [bg-blue-500, font-bold, bg-gray-500]
 */
export function DirectTernaryMultipleClasses() {
	return (
		<div className={isActive ? 'bg-blue-500 invalid-class font-bold' : 'bg-gray-500'}>
			Multiple classes with invalid
		</div>
	);
}

// ========================================
// NESTED TERNARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Nested ternary expressions
 * @validClasses [bg-blue-500, bg-green-500, bg-gray-500]
 */
export function NestedTernaryValid() {
	return (
		<div className={isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'}>
			Nested ternary
		</div>
	);
}

/**
 * ❌ Invalid: Nested ternary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [bg-green-500, bg-gray-500]
 */
export function NestedTernaryInvalid() {
	return (
		<div className={isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'}>
			Nested ternary invalid
		</div>
	);
}

// ========================================
// TERNARY WITH VARIANTS
// ========================================

/**
 * ✅ Valid: Ternary with Tailwind variants
 * @validClasses [hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
 */
export function TernaryWithVariants() {
	return (
		<div className={isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'}>
			Ternary with variants
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [hover:bg-gray-500]
 */
export function TernaryWithInvalidVariant() {
	return (
		<div className={isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500'}>
			Ternary with invalid variant
		</div>
	);
}

// ========================================
// TERNARY WITH ARBITRARY VALUES
// ========================================

/**
 * ✅ Valid: Ternary with arbitrary values
 * @validClasses [h-[50vh], w-[100px], h-[30vh], w-[50px]]
 */
export function TernaryWithArbitraryValues() {
	return (
		<div className={isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]'}>
			Ternary with arbitrary values
		</div>
	);
}

/**
 * ❌ Invalid: Ternary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], h-[30vh]]
 */
export function TernaryWithArbitraryAndInvalid() {
	return (
		<div className={isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]'}>
			Ternary with arbitrary and invalid
		</div>
	);
}

// ========================================
// EMPTY STRING BRANCHES
// ========================================

/**
 * ✅ Valid: Ternary with empty string in false branch
 * @validClasses [bg-blue-500]
 */
export function TernaryWithEmptyFalse() {
	return <div className={isActive ? 'bg-blue-500' : ''}>Empty false branch</div>;
}

/**
 * ✅ Valid: Ternary with empty string in true branch
 * @validClasses [bg-gray-500]
 */
export function TernaryWithEmptyTrue() {
	return <div className={isActive ? '' : 'bg-gray-500'}>Empty true branch</div>;
}

/**
 * ❌ Invalid: Ternary with invalid in non-empty branch
 * @invalidClasses [invalid-class]
 */
export function TernaryWithEmptyAndInvalid() {
	return <div className={isActive ? 'invalid-class' : ''}>Invalid with empty</div>;
}

// ========================================
// PARENTHESIZED EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Parenthesized ternary expression
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function ParenthesizedTernaryValid() {
	return <div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Parenthesized ternary</div>;
}

/**
 * ❌ Invalid: Parenthesized ternary with invalid
 * @invalidClasses [invalid-active]
 * @validClasses [bg-gray-500]
 */
export function ParenthesizedTernaryInvalid() {
	return (
		<div className={isActive ? 'invalid-active' : 'bg-gray-500'}>Parenthesized with invalid</div>
	);
}

// ========================================
// COMPLEX CONDITIONS
// ========================================

/**
 * ✅ Valid: Ternary with complex condition
 * @validClasses [bg-red-500, bg-gray-500]
 */
export function ComplexConditionValid() {
	return (
		<div className={isActive && !isDisabled ? 'bg-red-500' : 'bg-gray-500'}>Complex condition</div>
	);
}

/**
 * ❌ Invalid: Ternary with complex condition and invalid class
 * @invalidClasses [invalid-alert]
 * @validClasses [bg-gray-500]
 */
export function ComplexConditionInvalid() {
	return (
		<div className={hasError || isLoading ? 'invalid-alert' : 'bg-gray-500'}>
			Complex condition invalid
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
 * @validClasses {1} [bg-gray-500]
 * @element {2} Second child with all valid
 * @validClasses {2} [bg-blue-500, bg-gray-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [bg-gray-500]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={isActive ? 'invalid-active' : 'bg-gray-500'}>Invalid in first child</div>
			<div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Valid in second child</div>
			<div className={isActive ? 'invalid-class' : 'bg-gray-500'}>Invalid in third child</div>
		</div>
	);
}

// ========================================
// MIXED WITH OTHER PATTERNS
// ========================================

/**
 * ✅ Valid: Ternary combined with static in template
 * Note: This is a template literal pattern, not pure expression
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryWithStaticWrapper() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>Ternary in template</div>
	);
}

/**
 * ✅ Valid: Ternary in function call wrapper
 * Note: This is a function pattern, not pure expression
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryWithFunctionWrapper() {
	return (
		<div className={clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Ternary in function
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with ternary expression
 * @validClasses [rounded-lg, rounded-sm]
 */
export function SelfClosingTernaryValid() {
	return <img className={isActive ? 'rounded-lg' : 'rounded-sm'} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid in ternary
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function SelfClosingTernaryInvalid() {
	return <img className={isActive ? 'invalid-style' : 'rounded-lg'} src="test.jpg" alt="test" />;
}

// ========================================
// TERNARY WITH BOOLEAN/NULL RESULTS
// ========================================

/**
 * ✅ Valid: Ternary with undefined result (ignored)
 * @validClasses [bg-gray-500]
 */
export function TernaryWithUndefinedResult() {
	return <div className={isActive ? undefined : 'bg-gray-500'}>Ternary with undefined</div>;
}

// Mock function declaration
declare function clsx(...args: (string | boolean | null | undefined)[]): string;
