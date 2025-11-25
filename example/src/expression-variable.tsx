/**
 * E2E Test: Expression Variable Reference
 * Context: expression (direct JSX expression)
 * Pattern: variable (identifier referencing a variable declaration)
 *
 * Tests validation of: className={variableName} where variableName is defined in scope
 *
 * NOTE: Variables are declared INSIDE functions so that errors at the declaration
 * site are within the function bounds (for test detection).
 */

// ========================================
// BASIC VARIABLE REFERENCES
// ========================================

/**
 * ✅ Valid: Direct variable reference with valid class
 * @validClasses [bg-blue-500]
 */
export function DirectVariableValid() {
	const validSingleClass = 'bg-blue-500';
	return <div className={validSingleClass}>Direct variable reference</div>;
}

/**
 * ❌ Invalid: Direct variable reference with invalid class
 * @invalidClasses [invalid-class]
 */
export function DirectVariableInvalid() {
	const invalidSingleClass = 'invalid-class';
	return <div className={invalidSingleClass}>Invalid variable reference</div>;
}

/**
 * ✅ Valid: Variable with multiple valid classes
 * @validClasses [flex, items-center, justify-between]
 */
export function MultipleValidClasses() {
	const multipleValidClasses = 'flex items-center justify-between';
	return <div className={multipleValidClasses}>Multiple valid classes</div>;
}

/**
 * ❌ Invalid: Variable with mix of valid and invalid classes
 * @invalidClasses [invalid-one, invalid-two]
 * @validClasses [flex, items-center]
 */
export function MixedValidInvalidClasses() {
	const mixedClasses = 'flex invalid-one items-center invalid-two';
	return <div className={mixedClasses}>Mixed valid and invalid classes</div>;
}

// ========================================
// TERNARY VARIABLE ASSIGNMENTS
// ========================================

/**
 * ✅ Valid: Variable assigned from ternary with all valid classes
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function TernaryVariableAllValid() {
	const isActive = true;
	const ternaryValidClasses = isActive ? 'bg-blue-500' : 'bg-gray-500';
	return <div className={ternaryValidClasses}>Ternary variable - all valid</div>;
}

/**
 * ❌ Invalid: Variable assigned from ternary with invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [bg-gray-500]
 */
export function TernaryVariableInvalidTrue() {
	const isActive = true;
	const ternaryInvalidTrue = isActive ? 'invalid-active' : 'bg-gray-500';
	return <div className={ternaryInvalidTrue}>Ternary variable - invalid in true</div>;
}

/**
 * ❌ Invalid: Variable assigned from ternary with invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [bg-blue-500]
 */
export function TernaryVariableInvalidFalse() {
	const isActive = true;
	const ternaryInvalidFalse = isActive ? 'bg-blue-500' : 'invalid-inactive';
	return <div className={ternaryInvalidFalse}>Ternary variable - invalid in false</div>;
}

/**
 * ❌ Invalid: Variable assigned from ternary with invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 */
export function TernaryVariableBothInvalid() {
	const isActive = true;
	const ternaryBothInvalid = isActive ? 'invalid-active' : 'invalid-inactive';
	return <div className={ternaryBothInvalid}>Ternary variable - both invalid</div>;
}

// ========================================
// NESTED TERNARY VARIABLE ASSIGNMENTS
// ========================================

/**
 * ✅ Valid: Nested ternary variable assignment
 * @validClasses [bg-blue-500, bg-green-500, bg-gray-500]
 */
export function NestedTernaryVariableValid() {
	const isActive = true;
	const isDisabled = false;
	const nestedTernaryValid = isActive
		? isDisabled
			? 'bg-blue-500'
			: 'bg-green-500'
		: 'bg-gray-500';
	return <div className={nestedTernaryValid}>Nested ternary variable - valid</div>;
}

/**
 * ❌ Invalid: Nested ternary with invalid class in nested branch
 * @invalidClasses [invalid-nested]
 * @validClasses [bg-green-500, bg-gray-500]
 */
export function NestedTernaryVariableInvalid() {
	const isActive = true;
	const isDisabled = false;
	const nestedTernaryInvalid = isActive
		? isDisabled
			? 'invalid-nested'
			: 'bg-green-500'
		: 'bg-gray-500';
	return <div className={nestedTernaryInvalid}>Nested ternary variable - invalid</div>;
}

// ========================================
// BINARY EXPRESSION VARIABLE ASSIGNMENTS
// ========================================

/**
 * ✅ Valid: Variable assigned from binary AND expression
 * @validClasses [bg-blue-500]
 */
export function BinaryAndVariableValid() {
	const isActive = true;
	const binaryAndValid = isActive && 'bg-blue-500';
	return <div className={binaryAndValid}>Binary AND variable - valid</div>;
}

/**
 * ❌ Invalid: Variable assigned from binary AND expression with invalid
 * @invalidClasses [invalid-class]
 */
export function BinaryAndVariableInvalid() {
	const isActive = true;
	const binaryAndInvalid = isActive && 'invalid-class';
	return <div className={binaryAndInvalid}>Binary AND variable - invalid</div>;
}

/**
 * ✅ Valid: Variable assigned from binary OR expression
 * @validClasses [bg-blue-500]
 */
export function BinaryOrVariableValid() {
	const isDisabled = false;
	const binaryOrValid = isDisabled || 'bg-blue-500';
	return <div className={binaryOrValid}>Binary OR variable - valid</div>;
}

/**
 * ❌ Invalid: Variable assigned from binary OR expression with invalid
 * @invalidClasses [invalid-fallback]
 */
export function BinaryOrVariableInvalid() {
	const isDisabled = false;
	const binaryOrInvalid = isDisabled || 'invalid-fallback';
	return <div className={binaryOrInvalid}>Binary OR variable - invalid</div>;
}

// ========================================
// TEMPLATE LITERAL VARIABLE ASSIGNMENTS
// ========================================

/**
 * ✅ Valid: Variable with no-substitution template literal
 * @validClasses [flex, items-center]
 */
export function TemplateNoSubstitutionValid() {
	const templateNoSubValid = `flex items-center`;
	return <div className={templateNoSubValid}>Template no substitution - valid</div>;
}

/**
 * ❌ Invalid: Variable with no-substitution template literal containing invalid
 * @invalidClasses [invalid-template]
 * @validClasses [flex]
 */
export function TemplateNoSubstitutionInvalid() {
	const templateNoSubInvalid = `flex invalid-template`;
	return <div className={templateNoSubInvalid}>Template no substitution - invalid</div>;
}

// ========================================
// TYPE ASSERTIONS
// ========================================

/**
 * ✅ Valid: Variable with as const assertion
 * @validClasses [bg-blue-500]
 */
export function AsConstValid() {
	const asConstValid = 'bg-blue-500' as const;
	return <div className={asConstValid}>As const assertion - valid</div>;
}

/**
 * ❌ Invalid: Variable with as const assertion containing invalid
 * @invalidClasses [invalid-const]
 */
export function AsConstInvalid() {
	const asConstInvalid = 'invalid-const' as const;
	return <div className={asConstInvalid}>As const assertion - invalid</div>;
}

// ========================================
// PARENTHESIZED EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Variable with parenthesized expression
 * @validClasses [bg-blue-500]
 */
export function ParenthesizedValid() {
	const parenthesizedValid = 'bg-blue-500';
	return <div className={parenthesizedValid}>Parenthesized expression - valid</div>;
}

/**
 * ❌ Invalid: Variable with parenthesized expression containing invalid
 * @invalidClasses [invalid-paren]
 */
export function ParenthesizedInvalid() {
	const parenthesizedInvalid = 'invalid-paren';
	return <div className={parenthesizedInvalid}>Parenthesized expression - invalid</div>;
}

// ========================================
// TAILWIND FEATURES IN VARIABLES
// ========================================

/**
 * ✅ Valid: Variable with arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ArbitraryValuesValid() {
	const arbitraryValid = 'h-[50vh] w-[100px] bg-[#ff0000]';
	return <div className={arbitraryValid}>Arbitrary values in variable - valid</div>;
}

/**
 * ✅ Valid: Variable with Tailwind variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, md:flex]
 */
export function VariantsValid() {
	const variantsValid = 'hover:bg-blue-500 focus:ring-2 md:flex';
	return <div className={variantsValid}>Variants in variable - valid</div>;
}

/**
 * ❌ Invalid: Variable with invalid variant
 * @invalidClasses [invalidvariant:bg-blue-500]
 * @validClasses [flex]
 */
export function InvalidVariantInVariable() {
	const invalidVariant = 'flex invalidvariant:bg-blue-500';
	return <div className={invalidVariant}>Invalid variant in variable</div>;
}

// ========================================
// MULTIPLE USAGES OF SAME VARIABLE
// ========================================

/**
 * ✅ Valid: Same variable used multiple times
 * @validClasses [flex, items-center]
 */
export function ReusedVariableValid() {
	const reusedValidClasses = 'flex items-center';
	return (
		<>
			<div className={reusedValidClasses}>First usage</div>
			<div className={reusedValidClasses}>Second usage</div>
		</>
	);
}

/**
 * ❌ Invalid: Same invalid variable used multiple times - errors at declaration
 * @invalidClasses [invalid-reused]
 */
export function ReusedVariableInvalidFirst() {
	const reusedInvalidClasses = 'invalid-reused';
	return <div className={reusedInvalidClasses}>Reused invalid - first</div>;
}

/**
 * ❌ Invalid: Another function with invalid variable
 * @invalidClasses [invalid-reused-2]
 */
export function ReusedVariableInvalidSecond() {
	const reusedInvalidClasses2 = 'invalid-reused-2';
	return <div className={reusedInvalidClasses2}>Reused invalid - second</div>;
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with variable reference
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingWithVariable() {
	const imgClasses = 'w-full h-auto';
	return <img className={imgClasses} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid variable
 * @invalidClasses [invalid-img-class]
 * @validClasses [w-full]
 */
export function SelfClosingWithInvalidVariable() {
	const invalidImgClasses = 'w-full invalid-img-class';
	return <img className={invalidImgClasses} src="test.jpg" alt="test" />;
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different variables
 * @invalidClasses [bad-class, another-bad]
 * @validClasses [flex, grid, flex-col]
 */
export function MultipleElementsWithVariables() {
	const firstChildClasses = 'flex';
	const secondChildClasses = 'bad-class';
	const thirdChildClasses = 'grid another-bad';
	return (
		<div className="flex flex-col">
			<div className={firstChildClasses}>Valid variable</div>
			<div className={secondChildClasses}>Invalid variable</div>
			<div className={thirdChildClasses}>Mixed variable</div>
		</div>
	);
}
