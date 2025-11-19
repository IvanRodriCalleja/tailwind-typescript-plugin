/**
 * E2E Test: JSX Template Literal with Interpolation
 *
 * Tests validation of: className={`... ${expr} ...`}
 */

// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ========================================
// BASIC TEMPLATE LITERAL TESTS
// ========================================

/**
 * ✅ Valid: Template literal without interpolation (no-substitution template)
 * @validClasses [flex, items-center]
 */
export function NoSubstitutionTemplate() {
	return <div className={`flex items-center`}>No interpolation</div>;
}

/**
 * ❌ Invalid: Template literal without interpolation, with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function NoSubstitutionTemplateInvalid() {
	return <div className={`flex invalid-class`}>No interpolation with invalid class</div>;
}

// ========================================
// SINGLE INTERPOLATION TESTS
// ========================================

/**
 * ✅ Valid: Template literal with interpolation, all static parts valid
 * @validClasses [flex, items-center]
 */
export function SingleInterpolationAllValid() {
	return (
		<div className={`flex ${dynamicClass} items-center`}>Valid classes with interpolation</div>
	);
}

/**
 * ❌ Invalid: Template literal with interpolation, invalid class before interpolation
 * @invalidClasses [invalid-before]
 */
export function SingleInterpolationInvalidBefore() {
	return <div className={`invalid-before ${dynamicClass}`}>Invalid before interpolation</div>;
}

/**
 * ❌ Invalid: Template literal with interpolation, invalid class after interpolation
 * @invalidClasses [invalid-after]
 */
export function SingleInterpolationInvalidAfter() {
	return <div className={`${dynamicClass} invalid-after`}>Invalid after interpolation</div>;
}

/**
 * ❌ Invalid: Template literal with interpolation, invalid classes on both sides
 * @invalidClasses [invalid-before, invalid-after]
 */
export function SingleInterpolationInvalidBoth() {
	return (
		<div className={`invalid-before ${dynamicClass} invalid-after`}>
			Invalid before and after interpolation
		</div>
	);
}

/**
 * ❌ Invalid: Template literal with interpolation, mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function SingleInterpolationMixed() {
	return (
		<div className={`flex ${dynamicClass} invalid-class items-center`}>
			Mixed valid and invalid with interpolation
		</div>
	);
}

// ========================================
// MULTIPLE INTERPOLATION TESTS
// ========================================

/**
 * ✅ Valid: Multiple interpolations with valid static classes
 * @validClasses [flex, items-center, justify-between]
 */
export function MultipleInterpolationsAllValid() {
	return (
		<div className={`flex ${dynamicClass} items-center ${anotherClass} justify-between`}>
			Multiple interpolations with valid classes
		</div>
	);
}

/**
 * ❌ Invalid: Multiple interpolations with invalid classes in different positions
 * @invalidClasses [invalid-first, invalid-middle, invalid-last]
 * @validClasses [flex]
 */
export function MultipleInterpolationsWithInvalid() {
	return (
		<div
			className={`invalid-first ${dynamicClass} invalid-middle flex ${anotherClass} invalid-last`}>
			Multiple interpolations with invalid classes
		</div>
	);
}

/**
 * ✅ Valid: Consecutive interpolations with classes between
 * @validClasses [flex, p-4]
 */
export function ConsecutiveInterpolations() {
	return (
		<div className={`${dynamicClass} flex ${anotherClass} p-4`}>Consecutive interpolations</div>
	);
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Empty static parts (only interpolation)
 */
export function OnlyInterpolation() {
	return <div className={`${dynamicClass}`}>Only interpolation</div>;
}

/**
 * ✅ Valid: Interpolation at start with trailing spaces
 * @validClasses [flex, items-center]
 */
export function InterpolationAtStart() {
	return <div className={`${dynamicClass} flex items-center`}>Interpolation at start</div>;
}

/**
 * ✅ Valid: Interpolation at end with leading spaces
 * @validClasses [flex, items-center]
 */
export function InterpolationAtEnd() {
	return <div className={`flex items-center ${dynamicClass}`}>Interpolation at end</div>;
}

/**
 * ✅ Valid: Extra spaces around interpolations
 * @validClasses [flex, items-center, justify-center]
 */
export function ExtraSpacesAroundInterpolation() {
	return (
		<div className={`flex  ${dynamicClass}  items-center   ${anotherClass}   justify-center`}>
			Extra spaces (should be handled correctly)
		</div>
	);
}

/**
 * ❌ Invalid: Single invalid class between interpolations
 * @invalidClasses [invalid-class]
 */
export function InvalidBetweenInterpolations() {
	return (
		<div className={`${dynamicClass} invalid-class ${anotherClass}`}>
			Invalid between interpolations
		</div>
	);
}

// ========================================
// TAILWIND FEATURES WITH INTERPOLATION
// ========================================

/**
 * ✅ Valid: Arbitrary values with interpolation
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ArbitraryValuesWithInterpolation() {
	return (
		<div className={`h-[50vh] ${dynamicClass} w-[100px] bg-[#ff0000]`}>
			Arbitrary values with interpolation
		</div>
	);
}

/**
 * ✅ Valid: Variants with interpolation
 * @validClasses [hover:bg-blue-500, focus:ring-2, md:flex]
 */
export function VariantsWithInterpolation() {
	return (
		<div className={`hover:bg-blue-500 ${dynamicClass} focus:ring-2 md:flex`}>
			Variants with interpolation
		</div>
	);
}

/**
 * ✅ Valid: Responsive variants with interpolation
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3, xl:grid-cols-4]
 */
export function ResponsiveVariantsWithInterpolation() {
	return (
		<div
			className={`sm:flex ${dynamicClass} md:grid lg:grid-cols-3 ${anotherClass} xl:grid-cols-4`}>
			Responsive variants with interpolation
		</div>
	);
}

/**
 * ✅ Valid: Dark mode variants with interpolation
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function DarkModeVariantsWithInterpolation() {
	return (
		<div className={`bg-white dark:bg-gray-900 ${dynamicClass} text-black dark:text-white`}>
			Dark mode variants with interpolation
		</div>
	);
}

/**
 * ❌ Invalid: Invalid variant with interpolation
 * @invalidClasses [invalidvariant:bg-blue-500]
 */
export function InvalidVariantWithInterpolation() {
	return (
		<div className={`${dynamicClass} invalidvariant:bg-blue-500`}>
			Invalid variant with interpolation
		</div>
	);
}

// ========================================
// COMPARISON WITH OTHER SYNTAXES
// ========================================

/**
 * Should behave consistently across different className syntaxes
 */
export function SyntaxComparison() {
	return (
		<>
			{/* String literal */}
			<div className="flex invalid-class items-center">String literal</div>

			{/* JSX expression with string */}
			<div className={'flex invalid-class items-center'}>JSX string expression</div>

			{/* Template literal without interpolation */}
			<div className={`flex invalid-class items-center`}>Template without interpolation</div>

			{/* Template literal with interpolation */}
			<div className={`flex ${dynamicClass} invalid-class items-center`}>
				Template with interpolation
			</div>
		</>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with template literal and interpolation
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingWithInterpolation() {
	return <img className={`w-full ${dynamicClass} h-auto`} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid class in template
 * @invalidClasses [invalid-class]
 * @validClasses [w-full]
 */
export function SelfClosingInvalidWithInterpolation() {
	return <img className={`invalid-class ${dynamicClass} w-full`} src="test.jpg" alt="test" />;
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with template literals
 * @element {1} First child with invalid class in template
 * @invalidClasses {1} [bad-class]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid classes
 * @validClasses {2} [container, mx-auto]
 * @element {3} Third child with invalid class after interpolation
 * @invalidClasses {3} [another-bad]
 * @validClasses {3} [grid]
 */
export function MultipleElementsWithTemplates() {
	return (
		<div className="flex flex-col">
			<div className={`flex ${dynamicClass} bad-class`}>Invalid in first child</div>
			<div className={`container ${anotherClass} mx-auto`}>Valid in second child</div>
			<div className={`grid ${dynamicClass} another-bad`}>Invalid in third child</div>
		</div>
	);
}
