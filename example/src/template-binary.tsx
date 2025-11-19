/**
 * E2E Test: Template Binary
 * Context: template (template literal)
 * Pattern: binary (with binary/logical expressions)
 *
 * Tests validation of: className={`... ${condition && 'class'} ...`}
 */

// Simulate dynamic values that might come from props or state
const dynamicClass = 'some-dynamic-class';
const isError = false;
const isActive = true;
const isDisabled = false;
const hasWarning = false;

// ========================================
// BASIC BINARY EXPRESSION TESTS (&&)
// ========================================

/**
 * ✅ Valid: Simple binary expression with valid class
 * @validClasses [flex, text-red-500]
 */
export function SimpleBinaryAllValid() {
	return (
		<div className={`flex ${isError && 'text-red-500'}`}>
			Simple binary expression with valid class
		</div>
	);
}

/**
 * ❌ Invalid: Binary expression with invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function SimpleBinaryInvalidClass() {
	return (
		<div className={`flex ${isError && 'invalid-error'}`}>Binary expression with invalid class</div>
	);
}

/**
 * ❌ Invalid: Binary expression with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, text-red-500, font-bold]
 */
export function BinaryWithMultipleClasses() {
	return (
		<div className={`flex ${isError && 'text-red-500 invalid-class font-bold'}`}>
			Binary with multiple classes
		</div>
	);
}

/**
 * ❌ Invalid: Static invalid class before binary expression
 * @invalidClasses [invalid-static]
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithStaticInvalid() {
	return (
		<div className={`flex invalid-static ${isError && 'text-red-500'}`}>
			Static invalid with binary
		</div>
	);
}

/**
 * ❌ Invalid: Static invalid class after binary expression
 * @invalidClasses [invalid-after]
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithInvalidAfter() {
	return (
		<div className={`flex ${isError && 'text-red-500'} invalid-after`}>
			Binary with invalid after
		</div>
	);
}

// ========================================
// MULTIPLE BINARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Multiple binary expressions with valid classes
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function MultipleBinaryAllValid() {
	return (
		<div className={`flex ${isError && 'text-red-500'} ${hasWarning && 'bg-yellow-100'}`}>
			Multiple binary expressions with valid classes
		</div>
	);
}

/**
 * ❌ Invalid: Multiple binary expressions with invalid classes
 * @invalidClasses [invalid-error, invalid-warning]
 * @validClasses [flex]
 */
export function MultipleBinaryInvalidClasses() {
	return (
		<div className={`flex ${isError && 'invalid-error'} ${hasWarning && 'invalid-warning'}`}>
			Multiple binary expressions with invalid classes
		</div>
	);
}

/**
 * ❌ Invalid: Mix of valid and invalid binary expressions
 * @invalidClasses [invalid-warning]
 * @validClasses [flex, text-red-500]
 */
export function MultipleBinaryMixed() {
	return (
		<div className={`flex ${isError && 'text-red-500'} ${hasWarning && 'invalid-warning'}`}>
			Mix of valid and invalid binary expressions
		</div>
	);
}

// ========================================
// BINARY EXPRESSION WITH OR (||)
// ========================================

/**
 * ✅ Valid: Binary OR expression with valid class
 * @validClasses [flex, bg-gray-500]
 */
export function BinaryOrAllValid() {
	return <div className={`flex ${dynamicClass || 'bg-gray-500'}`}>Binary OR with valid class</div>;
}

/**
 * ❌ Invalid: Binary OR expression with invalid class
 * @invalidClasses [invalid-fallback]
 * @validClasses [flex]
 */
export function BinaryOrInvalidClass() {
	return (
		<div className={`flex ${dynamicClass || 'invalid-fallback'}`}>Binary OR with invalid class</div>
	);
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Binary expression that evaluates to empty string
 * @validClasses [flex, items-center]
 */
export function BinaryWithEmptyString() {
	return <div className={`flex ${false && 'text-red-500'} items-center`}>Binary with false</div>;
}

/**
 * ✅ Valid: Nested binary expressions
 * @validClasses [flex, text-red-500, font-bold]
 */
export function NestedBinaryValid() {
	return (
		<div className={`flex ${isError && isActive && 'text-red-500 font-bold'}`}>
			Nested binary expressions
		</div>
	);
}

/**
 * ❌ Invalid: Nested binary expressions with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex]
 */
export function NestedBinaryInvalid() {
	return (
		<div className={`flex ${isError && isActive && 'invalid-nested'}`}>
			Nested binary with invalid
		</div>
	);
}

// ========================================
// BINARY WITH VARIANTS
// ========================================

/**
 * ✅ Valid: Binary expression with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:text-lg]
 */
export function BinaryWithVariants() {
	return (
		<div className={`flex ${isActive && 'hover:bg-blue-500 md:text-lg'}`}>Binary with variants</div>
	);
}

/**
 * ❌ Invalid: Binary expression with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function BinaryWithInvalidVariant() {
	return (
		<div className={`flex ${isActive && 'invalid-variant:bg-blue'}`}>
			Binary with invalid variant
		</div>
	);
}

// ========================================
// BINARY WITH ARBITRARY VALUES
// ========================================

/**
 * ✅ Valid: Binary expression with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px]]
 */
export function BinaryWithArbitraryValues() {
	return (
		<div className={`flex ${isActive && 'h-[50vh] w-[100px]'}`}>Binary with arbitrary values</div>
	);
}

/**
 * ❌ Invalid: Binary with mix of arbitrary and invalid classes
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh]]
 */
export function BinaryWithArbitraryAndInvalid() {
	return (
		<div className={`flex ${isActive && 'h-[50vh] invalid-size'}`}>
			Binary with arbitrary and invalid
		</div>
	);
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ✅ Valid: Binary and ternary combined
 * @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
 */
export function BinaryAndTernaryValid() {
	return (
		<div
			className={`flex ${isError && 'text-red-500'} ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
			Binary and ternary combined
		</div>
	);
}

/**
 * ❌ Invalid: Binary and ternary with invalid classes
 * @invalidClasses [invalid-error, invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function BinaryAndTernaryInvalid() {
	return (
		<div
			className={`flex ${isError && 'invalid-error'} ${isActive ? 'invalid-active' : 'bg-gray-500'}`}>
			Binary and ternary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Multiple conditions with mixed validity
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ComplexMixedValidity() {
	return (
		<div
			className={`flex ${isError && 'text-red-500'} ${hasWarning && 'bg-yellow-100'} ${isDisabled && 'invalid-disabled'}`}>
			Complex mixed validity
		</div>
	);
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid class in binary
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid classes
 * @validClasses {2} [flex, text-red-500]
 * @element {3} Third child with invalid class
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={`flex ${isError && 'invalid-error'}`}>Invalid in first child</div>
			<div className={`flex ${isError && 'text-red-500'}`}>Valid in second child</div>
			<div className={`flex ${isError && 'invalid-class'}`}>Invalid in third child</div>
		</div>
	);
}
