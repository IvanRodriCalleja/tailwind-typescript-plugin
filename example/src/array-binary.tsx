/**
 * E2E Test: Array Binary
 * Context: array (array literal)
 * Pattern: binary (with binary/logical expressions)
 *
 * Tests validation of: className={cn(['flex', isError && 'class'])}
 */

// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;
const isDisabled = false;
const hasWarning = false;

// ========================================
// BASIC BINARY IN ARRAY
// ========================================

/**
 * ✅ Valid: Array with binary expression, all valid
 * @validClasses [flex, text-red-500]
 */
export function ArrayBinaryAllValid() {
	return <div className={cn(['flex', isError && 'text-red-500'])}>Array with binary</div>;
}

/**
 * ❌ Invalid: Array with binary expression, invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function ArrayBinaryInvalid() {
	return <div className={cn(['flex', isError && 'invalid-error'])}>Array with invalid binary</div>;
}

/**
 * ❌ Invalid: Binary with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, text-red-500, font-bold]
 */
export function ArrayBinaryMultipleClasses() {
	return (
		<div className={cn(['flex', isError && 'text-red-500 invalid-class font-bold'])}>
			Binary with multiple classes
		</div>
	);
}

// ========================================
// MULTIPLE BINARY EXPRESSIONS IN ARRAY
// ========================================

/**
 * ✅ Valid: Multiple binary expressions in array, all valid
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ArrayMultipleBinaryAllValid() {
	return (
		<div className={cn(['flex', isError && 'text-red-500', hasWarning && 'bg-yellow-100'])}>
			Multiple binary in array
		</div>
	);
}

/**
 * ❌ Invalid: Multiple binary expressions with invalid classes
 * @invalidClasses [invalid-error, invalid-warning]
 * @validClasses [flex]
 */
export function ArrayMultipleBinaryInvalid() {
	return (
		<div className={cn(['flex', isError && 'invalid-error', hasWarning && 'invalid-warning'])}>
			Multiple binary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Mix of valid and invalid binary in array
 * @invalidClasses [invalid-warning]
 * @validClasses [flex, text-red-500]
 */
export function ArrayMultipleBinaryMixed() {
	return (
		<div className={cn(['flex', isError && 'text-red-500', hasWarning && 'invalid-warning'])}>
			Mixed binary in array
		</div>
	);
}

// ========================================
// BINARY WITH OR (||)
// ========================================

/**
 * ✅ Valid: Binary OR in array with valid class
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayBinaryOrValid() {
	return <div className={cn(['flex', isError || 'bg-gray-500'])}>Binary OR in array</div>;
}

/**
 * ❌ Invalid: Binary OR in array with invalid class
 * @invalidClasses [invalid-fallback]
 * @validClasses [flex]
 */
export function ArrayBinaryOrInvalid() {
	return <div className={cn(['flex', isError || 'invalid-fallback'])}>Binary OR invalid</div>;
}

// ========================================
// MIXED STATIC AND BINARY IN ARRAY
// ========================================

/**
 * ✅ Valid: Mix of static and binary in array
 * @validClasses [flex, items-center, text-red-500, font-bold]
 */
export function ArrayMixedStaticBinaryValid() {
	return (
		<div className={cn(['flex', 'items-center', isError && 'text-red-500', 'font-bold'])}>
			Mixed static and binary
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in both static and binary
 * @invalidClasses [invalid-static, invalid-binary]
 * @validClasses [flex, items-center]
 */
export function ArrayMixedStaticBinaryInvalid() {
	return (
		<div className={cn(['flex', 'invalid-static', isError && 'invalid-binary', 'items-center'])}>
			Mixed with invalid
		</div>
	);
}

// ========================================
// NESTED BINARY IN ARRAY
// ========================================

/**
 * ✅ Valid: Nested binary expressions in array
 * @validClasses [flex, text-red-500, font-bold]
 */
export function ArrayNestedBinaryValid() {
	return (
		<div className={cn(['flex', isError && isActive && 'text-red-500 font-bold'])}>
			Nested binary in array
		</div>
	);
}

/**
 * ❌ Invalid: Nested binary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex]
 */
export function ArrayNestedBinaryInvalid() {
	return (
		<div className={cn(['flex', isError && isActive && 'invalid-nested'])}>
			Nested binary invalid
		</div>
	);
}

// ========================================
// BINARY WITH VARIANTS IN ARRAY
// ========================================

/**
 * ✅ Valid: Binary with Tailwind variants in array
 * @validClasses [flex, hover:bg-blue-500, md:text-lg]
 */
export function ArrayBinaryWithVariants() {
	return (
		<div className={cn(['flex', isActive && 'hover:bg-blue-500 md:text-lg'])}>
			Binary with variants
		</div>
	);
}

/**
 * ❌ Invalid: Binary with invalid variant in array
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function ArrayBinaryWithInvalidVariant() {
	return (
		<div className={cn(['flex', isActive && 'invalid-variant:bg-blue'])}>
			Binary with invalid variant
		</div>
	);
}

// ========================================
// BINARY WITH ARBITRARY VALUES IN ARRAY
// ========================================

/**
 * ✅ Valid: Binary with arbitrary values in array
 * @validClasses [flex, h-[50vh], w-[100px]]
 */
export function ArrayBinaryWithArbitraryValues() {
	return (
		<div className={cn(['flex', isActive && 'h-[50vh] w-[100px]'])}>
			Binary with arbitrary values
		</div>
	);
}

/**
 * ❌ Invalid: Binary with mix of arbitrary and invalid in array
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh]]
 */
export function ArrayBinaryWithArbitraryAndInvalid() {
	return (
		<div className={cn(['flex', isActive && 'h-[50vh] invalid-size'])}>
			Binary with arbitrary and invalid
		</div>
	);
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ✅ Valid: Array with binary and ternary combined
 * @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
 */
export function ArrayBinaryAndTernaryValid() {
	return (
		<div
			className={cn([
				'flex',
				isError && 'text-red-500',
				isActive ? 'bg-blue-500' : 'bg-gray-500'
			])}>
			Binary and ternary in array
		</div>
	);
}

/**
 * ❌ Invalid: Array with binary and ternary with invalid
 * @invalidClasses [invalid-error, invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function ArrayBinaryAndTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isError && 'invalid-error',
				isActive ? 'invalid-active' : 'bg-gray-500'
			])}>
			Binary and ternary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Complex array with multiple conditions
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ArrayComplexConditions() {
	return (
		<div
			className={cn([
				'flex',
				isError && 'text-red-500',
				hasWarning && 'bg-yellow-100',
				isDisabled && 'invalid-disabled'
			])}>
			Complex conditions in array
		</div>
	);
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Binary in array with clsx()
 * @validClasses [flex, text-red-500]
 */
export function ArrayBinaryInClsx() {
	return <div className={clsx(['flex', isError && 'text-red-500'])}>Binary in clsx array</div>;
}

/**
 * ❌ Invalid: Binary in array with clsx() invalid
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function ArrayBinaryInClsxInvalid() {
	return <div className={clsx(['flex', isError && 'invalid-error'])}>Binary in clsx invalid</div>;
}

/**
 * ✅ Valid: Binary in array with classNames()
 * @validClasses [flex, text-red-500]
 */
export function ArrayBinaryInClassNames() {
	return <div className={classNames(['flex', isError && 'text-red-500'])}>Binary in classNames</div>;
}

// ========================================
// NESTED FUNCTION CALLS
// ========================================

/**
 * ✅ Valid: Nested functions with binary in array
 * @validClasses [flex, text-red-500, items-center]
 */
export function ArrayNestedFunctionsWithBinary() {
	return (
		<div className={clsx('flex', cn([isError && 'text-red-500', 'items-center']))}>
			Nested with binary
		</div>
	);
}

/**
 * ❌ Invalid: Nested functions with invalid binary in array
 * @invalidClasses [invalid-error]
 * @validClasses [flex, items-center]
 */
export function ArrayNestedFunctionsWithBinaryInvalid() {
	return (
		<div className={clsx('flex', cn([isError && 'invalid-error', 'items-center']))}>
			Nested with invalid
		</div>
	);
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in binary
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, text-red-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex]
 */
export function ArrayBinaryMultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={cn(['flex', isError && 'invalid-error'])}>Invalid in first</div>
			<div className={cn(['flex', isError && 'text-red-500'])}>Valid in second</div>
			<div className={cn(['flex', isError && 'invalid-class'])}>Invalid in third</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing with binary in array
 * @validClasses [rounded-lg, shadow-md]
 */
export function ArrayBinarySelfClosingValid() {
	return <img className={cn([isActive && 'rounded-lg shadow-md'])} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing with invalid binary in array
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function ArrayBinarySelfClosingInvalid() {
	return <img className={cn([isActive && 'rounded-lg invalid-style'])} src="test.jpg" alt="test" />;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function classNames(...args: (string | string[] | boolean | null | undefined)[]): string;
