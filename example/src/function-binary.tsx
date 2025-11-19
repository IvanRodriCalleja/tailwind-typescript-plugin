/**
 * E2E Test: Function Binary
 * Context: function (function call)
 * Pattern: binary (with binary/logical expressions)
 *
 * Tests validation of: className={clsx('flex', isError && 'class')}
 */

// Simulate dynamic values that might come from props or state
const isError = false;
const isActive = true;
const isDisabled = false;
const hasWarning = false;

// ========================================
// BASIC BINARY EXPRESSION (&&)
// ========================================

/**
 * ✅ Valid: Function with binary expression, valid class
 * @validClasses [flex, text-red-500]
 */
export function FunctionBinaryAllValid() {
	return (
		<div className={clsx('flex', isError && 'text-red-500')}>Function with binary expression</div>
	);
}

/**
 * ❌ Invalid: Function with binary expression, invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function FunctionBinaryInvalidClass() {
	return (
		<div className={clsx('flex', isError && 'invalid-error')}>
			Function with invalid class in binary
		</div>
	);
}

/**
 * ❌ Invalid: Function with binary expression with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, text-red-500, font-bold]
 */
export function FunctionBinaryMultipleClasses() {
	return (
		<div className={clsx('flex', isError && 'text-red-500 invalid-class font-bold')}>
			Binary with multiple classes
		</div>
	);
}

// ========================================
// MULTIPLE ARGUMENTS WITH BINARY
// ========================================

/**
 * ✅ Valid: Multiple arguments with binary expressions, all valid
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function MultipleBinaryArgsAllValid() {
	return (
		<div className={clsx('flex', isError && 'text-red-500', hasWarning && 'bg-yellow-100')}>
			Multiple binary arguments
		</div>
	);
}

/**
 * ❌ Invalid: Multiple binary arguments with invalid classes
 * @invalidClasses [invalid-error, invalid-warning]
 * @validClasses [flex]
 */
export function MultipleBinaryArgsInvalid() {
	return (
		<div className={clsx('flex', isError && 'invalid-error', hasWarning && 'invalid-warning')}>
			Multiple binary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Mix of valid and invalid binary arguments
 * @invalidClasses [invalid-warning]
 * @validClasses [flex, text-red-500]
 */
export function MultipleBinaryArgsMixed() {
	return (
		<div className={clsx('flex', isError && 'text-red-500', hasWarning && 'invalid-warning')}>
			Mixed binary arguments
		</div>
	);
}

// ========================================
// BINARY WITH OR (||)
// ========================================

/**
 * ✅ Valid: Function with OR binary expression
 * @validClasses [flex, bg-gray-500]
 */
export function FunctionBinaryOrValid() {
	return <div className={clsx('flex', isError || 'bg-gray-500')}>Function with OR expression</div>;
}

/**
 * ❌ Invalid: Function with OR binary expression, invalid class
 * @invalidClasses [invalid-fallback]
 * @validClasses [flex]
 */
export function FunctionBinaryOrInvalid() {
	return <div className={clsx('flex', isError || 'invalid-fallback')}>OR with invalid class</div>;
}

// ========================================
// MIXED STATIC AND BINARY
// ========================================

/**
 * ✅ Valid: Mix of static strings and binary expressions
 * @validClasses [flex, items-center, text-red-500, font-bold]
 */
export function MixedStaticAndBinaryValid() {
	return (
		<div className={clsx('flex', 'items-center', isError && 'text-red-500', 'font-bold')}>
			Mixed static and binary
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in both static and binary
 * @invalidClasses [invalid-static, invalid-binary]
 * @validClasses [flex, items-center]
 */
export function MixedStaticAndBinaryInvalid() {
	return (
		<div className={clsx('flex', 'invalid-static', isError && 'invalid-binary', 'items-center')}>
			Mixed with invalid
		</div>
	);
}

// ========================================
// NESTED BINARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Nested binary expressions
 * @validClasses [flex, text-red-500, font-bold]
 */
export function NestedBinaryValid() {
	return (
		<div className={clsx('flex', isError && isActive && 'text-red-500 font-bold')}>
			Nested binary
		</div>
	);
}

/**
 * ❌ Invalid: Nested binary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex]
 */
export function NestedBinaryInvalid() {
	return (
		<div className={clsx('flex', isError && isActive && 'invalid-nested')}>
			Nested binary invalid
		</div>
	);
}

// ========================================
// BINARY WITH VARIANTS
// ========================================

/**
 * ✅ Valid: Binary with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:text-lg]
 */
export function BinaryWithVariants() {
	return (
		<div className={clsx('flex', isActive && 'hover:bg-blue-500 md:text-lg')}>
			Binary with variants
		</div>
	);
}

/**
 * ❌ Invalid: Binary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function BinaryWithInvalidVariant() {
	return (
		<div className={clsx('flex', isActive && 'invalid-variant:bg-blue')}>
			Binary with invalid variant
		</div>
	);
}

// ========================================
// BINARY WITH ARBITRARY VALUES
// ========================================

/**
 * ✅ Valid: Binary with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px]]
 */
export function BinaryWithArbitraryValues() {
	return (
		<div className={clsx('flex', isActive && 'h-[50vh] w-[100px]')}>
			Binary with arbitrary values
		</div>
	);
}

/**
 * ❌ Invalid: Binary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh]]
 */
export function BinaryWithArbitraryAndInvalid() {
	return (
		<div className={clsx('flex', isActive && 'h-[50vh] invalid-size')}>
			Binary with arbitrary and invalid
		</div>
	);
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ✅ Valid: Binary and ternary combined in function
 * @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
 */
export function BinaryAndTernaryValid() {
	return (
		<div
			className={clsx('flex', isError && 'text-red-500', isActive ? 'bg-blue-500' : 'bg-gray-500')}>
			Binary and ternary in function
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
			className={clsx(
				'flex',
				isError && 'invalid-error',
				isActive ? 'invalid-active' : 'bg-gray-500'
			)}>
			Binary and ternary with invalid
		</div>
	);
}

/**
 * ❌ Invalid: Complex mix with multiple conditions
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ComplexMixedConditions() {
	return (
		<div
			className={clsx(
				'flex',
				isError && 'text-red-500',
				hasWarning && 'bg-yellow-100',
				isDisabled && 'invalid-disabled'
			)}>
			Complex mixed conditions
		</div>
	);
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Binary in cn() function
 * @validClasses [flex, text-red-500]
 */
export function BinaryInCnFunction() {
	return <div className={cn('flex', isError && 'text-red-500')}>Binary in cn()</div>;
}

/**
 * ❌ Invalid: Binary in cn() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function BinaryInCnFunctionInvalid() {
	return <div className={cn('flex', isError && 'invalid-class')}>Binary in cn() invalid</div>;
}

/**
 * ✅ Valid: Binary in classNames() function
 * @validClasses [flex, text-red-500]
 */
export function BinaryInClassNamesFunction() {
	return (
		<div className={classNames('flex', isError && 'text-red-500')}>Binary in classNames()</div>
	);
}

// ========================================
// NESTED FUNCTION CALLS WITH BINARY
// ========================================

/**
 * ✅ Valid: Nested functions with binary expressions
 * @validClasses [flex, text-red-500, items-center]
 */
export function NestedFunctionsWithBinary() {
	return (
		<div className={clsx('flex', cn(isError && 'text-red-500', 'items-center'))}>
			Nested functions with binary
		</div>
	);
}

/**
 * ❌ Invalid: Nested functions with invalid in binary
 * @invalidClasses [invalid-error]
 * @validClasses [flex, items-center]
 */
export function NestedFunctionsWithBinaryInvalid() {
	return (
		<div className={clsx('flex', cn(isError && 'invalid-error', 'items-center'))}>
			Nested with invalid binary
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
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx('flex', isError && 'invalid-error')}>Invalid in first child</div>
			<div className={clsx('flex', isError && 'text-red-500')}>Valid in second child</div>
			<div className={clsx('flex', isError && 'invalid-class')}>Invalid in third child</div>
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: (string | boolean | undefined)[]): string;
declare function cn(...args: (string | boolean | undefined)[]): string;
declare function classNames(...args: (string | boolean | undefined)[]): string;
