/**
 * E2E Test: Expression Binary
 * Context: expression (direct JSX expression)
 * Pattern: binary (with binary/logical expressions)
 *
 * Tests validation of: className={isError && 'class'}
 */

// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;
const hasWarning = false;

// ========================================
// BASIC BINARY EXPRESSION (&&)
// ========================================

/**
 * ✅ Valid: Direct binary expression with valid class
 * @validClasses [text-red-500]
 */
export function DirectBinaryAllValid() {
	return <div className={isError && 'text-red-500'}>Direct binary expression</div>;
}

/**
 * ❌ Invalid: Direct binary expression with invalid class
 * @invalidClasses [invalid-error]
 */
export function DirectBinaryInvalid() {
	return <div className={isError && 'invalid-error'}>Direct binary with invalid</div>;
}

/**
 * ❌ Invalid: Binary expression with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [text-red-500, font-bold]
 */
export function DirectBinaryMultipleClasses() {
	return (
		<div className={isError && 'text-red-500 invalid-class font-bold'}>
			Binary with multiple classes
		</div>
	);
}

// ========================================
// BINARY WITH OR (||)
// ========================================

/**
 * ✅ Valid: Direct OR binary expression
 * @validClasses [bg-gray-500]
 */
export function DirectBinaryOrValid() {
	return <div className={isError || 'bg-gray-500'}>Direct OR expression</div>;
}

/**
 * ❌ Invalid: Direct OR binary expression with invalid class
 * @invalidClasses [invalid-fallback]
 */
export function DirectBinaryOrInvalid() {
	return <div className={isError || 'invalid-fallback'}>OR with invalid class</div>;
}

// ========================================
// NESTED BINARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Nested binary expressions
 * @validClasses [text-red-500, font-bold]
 */
export function NestedBinaryValid() {
	return <div className={isError && isActive && 'text-red-500 font-bold'}>Nested binary</div>;
}

/**
 * ❌ Invalid: Nested binary with invalid class
 * @invalidClasses [invalid-nested]
 */
export function NestedBinaryInvalid() {
	return <div className={isError && isActive && 'invalid-nested'}>Nested binary invalid</div>;
}

// ========================================
// BINARY WITH VARIANTS
// ========================================

/**
 * ✅ Valid: Binary with Tailwind variants
 * @validClasses [hover:bg-blue-500, md:text-lg]
 */
export function BinaryWithVariants() {
	return <div className={isActive && 'hover:bg-blue-500 md:text-lg'}>Binary with variants</div>;
}

/**
 * ❌ Invalid: Binary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 */
export function BinaryWithInvalidVariant() {
	return <div className={isActive && 'invalid-variant:bg-blue'}>Binary with invalid variant</div>;
}

// ========================================
// BINARY WITH ARBITRARY VALUES
// ========================================

/**
 * ✅ Valid: Binary with arbitrary values
 * @validClasses [h-[50vh], w-[100px]]
 */
export function BinaryWithArbitraryValues() {
	return <div className={isActive && 'h-[50vh] w-[100px]'}>Binary with arbitrary values</div>;
}

/**
 * ❌ Invalid: Binary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh]]
 */
export function BinaryWithArbitraryAndInvalid() {
	return (
		<div className={isActive && 'h-[50vh] invalid-size'}>Binary with arbitrary and invalid</div>
	);
}

// ========================================
// PARENTHESIZED EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Parenthesized binary expression
 * @validClasses [text-red-500]
 */
export function ParenthesizedBinaryValid() {
	return <div className={isError && 'text-red-500'}>Parenthesized binary</div>;
}

/**
 * ❌ Invalid: Parenthesized binary with invalid
 * @invalidClasses [invalid-error]
 */
export function ParenthesizedBinaryInvalid() {
	return <div className={isError && 'invalid-error'}>Parenthesized with invalid</div>;
}

// ========================================
// COMPLEX BOOLEAN LOGIC
// ========================================

/**
 * ✅ Valid: Complex boolean with all valid
 * @validClasses [bg-red-500]
 */
export function ComplexBooleanValid() {
	return <div className={(isError || hasWarning) && 'bg-red-500'}>Complex boolean logic</div>;
}

/**
 * ❌ Invalid: Complex boolean with invalid class
 * @invalidClasses [invalid-alert]
 */
export function ComplexBooleanInvalid() {
	return <div className={(isError || hasWarning) && 'invalid-alert'}>Complex boolean invalid</div>;
}

// ========================================
// BINARY WITH EMPTY STRING
// ========================================

/**
 * ✅ Valid: Binary with empty string (no classes to validate)
 */
export function BinaryWithEmptyString() {
	return <div className={isError && ''}>Binary with empty string</div>;
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in binary
 * @invalidClasses {1} [invalid-error]
 * @element {2} Second child with all valid
 * @validClasses {2} [text-red-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={isError && 'invalid-error'}>Invalid in first child</div>
			<div className={isError && 'text-red-500'}>Valid in second child</div>
			<div className={isError && 'invalid-class'}>Invalid in third child</div>
		</div>
	);
}

// ========================================
// MIXED WITH OTHER PATTERNS
// ========================================

/**
 * ✅ Valid: Binary expression combined with static wrapper
 * Note: This is actually a template literal pattern, not pure expression
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithStaticWrapper() {
	return <div className={`flex ${isError && 'text-red-500'}`}>Binary in template</div>;
}

/**
 * ✅ Valid: Binary in function call wrapper
 * Note: This is a function pattern, not pure expression
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithFunctionWrapper() {
	return <div className={clsx('flex', isError && 'text-red-500')}>Binary in function</div>;
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with binary expression
 * @validClasses [rounded-lg, shadow-md]
 */
export function SelfClosingBinaryValid() {
	return <img className={isActive && 'rounded-lg shadow-md'} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid in binary
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function SelfClosingBinaryInvalid() {
	return <img className={isActive && 'rounded-lg invalid-style'} src="test.jpg" alt="test" />;
}

// ========================================
// BOOLEAN RESULTS (should be ignored)
// ========================================

/**
 * ✅ Valid: Binary that resolves to boolean (falsy case)
 */
export function BinaryResolvesToBoolean() {
	return <div className={true && 'text-red-500'}>Boolean result</div>;
}

// Mock function declaration
declare function clsx(...args: (string | boolean | null | undefined)[]): string;
