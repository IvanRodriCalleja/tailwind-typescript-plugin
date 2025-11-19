/**
 * E2E Test: JSX Template Literal with Conditional Expressions
 *
 * Tests validation of: className={`... ${condition ? 'class1' : 'class2'} ...`}
 */

// Simulate dynamic values that might come from props or state
const dynamicClass = 'some-dynamic-class';
const isActive = true;
const isError = false;
const isDisabled = false;

// ========================================
// BASIC CONDITIONAL EXPRESSION TESTS
// ========================================

/**
 * ✅ Valid: Simple conditional with valid classes in both branches
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function SimpleConditionalAllValid() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
			Simple conditional with valid classes
		</div>
	);
}

/**
 * ❌ Invalid: Conditional with invalid class in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function ConditionalInvalidTrueBranch() {
	return (
		<div className={`flex ${isActive ? 'invalid-active' : 'bg-gray-500'}`}>
			Invalid class in true branch
		</div>
	);
}

/**
 * ❌ Invalid: Conditional with invalid class in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-blue-500]
 */
export function ConditionalInvalidFalseBranch() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'invalid-inactive'}`}>
			Invalid class in false branch
		</div>
	);
}

/**
 * ❌ Invalid: Conditional with invalid classes in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 * @validClasses [flex]
 */
export function ConditionalInvalidBothBranches() {
	return (
		<div className={`flex ${isActive ? 'invalid-active' : 'invalid-inactive'}`}>
			Invalid classes in both branches
		</div>
	);
}

/**
 * ❌ Invalid: Conditional with static invalid class before conditional
 * @invalidClasses [invalid-class, invalid-bg]
 * @validClasses [flex, bg-gray-500]
 */
export function ConditionalWithStaticInvalid() {
	return (
		<div className={`flex invalid-class ${isActive ? 'invalid-bg' : 'bg-gray-500'}`}>
			Static invalid class with conditional
		</div>
	);
}

// ========================================
// MULTIPLE CONDITIONAL EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Multiple conditionals with valid classes
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
 */
export function MultipleConditionalsAllValid() {
	return (
		<div
			className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'} ${isActive ? 'text-white' : 'text-black'}`}>
			Multiple conditionals with valid classes
		</div>
	);
}

/**
 * ❌ Invalid: Multiple conditionals with some invalid classes
 * @invalidClasses [invalid-bg, invalid-text]
 * @validClasses [flex, bg-blue-500, text-white]
 */
export function MultipleConditionalsWithInvalid() {
	return (
		<div
			className={`flex ${isActive ? 'bg-blue-500' : 'invalid-bg'} ${isError ? 'invalid-text' : 'text-white'}`}>
			Multiple conditionals with invalid classes
		</div>
	);
}

/**
 * ❌ Invalid: Mix of regular interpolation and conditional with invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500]
 */
export function MixedInterpolationAndConditional() {
	return (
		<div
			className={`flex ${dynamicClass} items-center ${isActive ? 'bg-blue-500' : 'bg-gray-500'} invalid-class`}>
			Mixed interpolation and conditional
		</div>
	);
}

// ========================================
// NESTED CONDITIONAL EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Nested conditionals with valid classes
 * @validClasses [flex, bg-blue-500, bg-red-500, bg-gray-500]
 */
export function NestedConditionalsAllValid() {
	return (
		<div className={`flex ${isActive ? (isError ? 'bg-red-500' : 'bg-blue-500') : 'bg-gray-500'}`}>
			Nested conditionals with valid classes
		</div>
	);
}

/**
 * ❌ Invalid: Nested conditional with invalid class in inner branch
 * @invalidClasses [invalid-error]
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function NestedConditionalInvalidInner() {
	return (
		<div
			className={`flex ${isActive ? (isError ? 'invalid-error' : 'bg-blue-500') : 'bg-gray-500'}`}>
			Nested conditional with invalid in inner branch
		</div>
	);
}

/**
 * ❌ Invalid: Nested conditional with invalid class in outer branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-red-500, bg-blue-500]
 */
export function NestedConditionalInvalidOuter() {
	return (
		<div
			className={`flex ${isActive ? (isError ? 'bg-red-500' : 'bg-blue-500') : 'invalid-inactive'}`}>
			Nested conditional with invalid in outer branch
		</div>
	);
}

// ========================================
// CONDITIONAL WITH EMPTY STRING
// ========================================

/**
 * ✅ Valid: Conditional with empty string in false branch
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ConditionalWithEmptyString() {
	return (
		<div className={`flex items-center ${isActive ? 'bg-blue-500' : ''}`}>
			Conditional with empty string
		</div>
	);
}

/**
 * ❌ Invalid: Conditional with invalid class and empty string
 * @invalidClasses [invalid-active]
 * @validClasses [flex]
 */
export function ConditionalInvalidWithEmptyString() {
	return (
		<div className={`flex ${isActive ? 'invalid-active' : ''}`}>
			Invalid class with empty string fallback
		</div>
	);
}

/**
 * ✅ Valid: Conditional with empty string in true branch
 * @validClasses [flex, bg-gray-500]
 */
export function ConditionalEmptyStringInTrue() {
	return <div className={`flex ${isActive ? '' : 'bg-gray-500'}`}>Empty in true branch</div>;
}

// ========================================
// CONDITIONAL WITH MULTIPLE CLASSES
// ========================================

/**
 * ✅ Valid: Conditional branches with multiple valid classes
 * @validClasses [flex, bg-blue-500, text-white, font-bold, bg-gray-500, text-black]
 */
export function ConditionalMultipleClassesValid() {
	return (
		<div
			className={`flex ${isActive ? 'bg-blue-500 text-white font-bold' : 'bg-gray-500 text-black'}`}>
			Conditional with multiple classes per branch
		</div>
	);
}

/**
 * ❌ Invalid: Conditional branches with multiple classes, some invalid
 * @invalidClasses [invalid-bg, invalid-text]
 * @validClasses [flex, text-white, font-bold, text-black]
 */
export function ConditionalMultipleClassesInvalid() {
	return (
		<div
			className={`flex ${isActive ? 'invalid-bg text-white font-bold' : 'invalid-text text-black'}`}>
			Conditional with multiple classes, some invalid
		</div>
	);
}

// ========================================
// TAILWIND FEATURES WITH CONDITIONALS
// ========================================

/**
 * ✅ Valid: Conditional with variants
 * @validClasses [flex, hover:bg-blue-500, hover:bg-gray-500]
 */
export function ConditionalWithVariants() {
	return (
		<div className={`flex ${isActive ? 'hover:bg-blue-500' : 'hover:bg-gray-500'}`}>
			Conditional with hover variants
		</div>
	);
}

/**
 * ✅ Valid: Conditional with responsive variants
 * @validClasses [flex, md:grid, md:grid-cols-3, md:flex, md:flex-col]
 */
export function ConditionalWithResponsive() {
	return (
		<div className={`flex ${isActive ? 'md:grid md:grid-cols-3' : 'md:flex md:flex-col'}`}>
			Conditional with responsive variants
		</div>
	);
}

/**
 * ✅ Valid: Conditional with arbitrary values
 * @validClasses [flex, h-[50vh], h-[100vh]]
 */
export function ConditionalWithArbitraryValues() {
	return (
		<div className={`flex ${isActive ? 'h-[50vh]' : 'h-[100vh]'}`}>
			Conditional with arbitrary values
		</div>
	);
}

/**
 * ❌ Invalid: Conditional with invalid variant
 * @invalidClasses [invalidvariant:bg-blue-500]
 * @validClasses [flex, hover:bg-gray-500]
 */
export function ConditionalWithInvalidVariant() {
	return (
		<div className={`flex ${isActive ? 'invalidvariant:bg-blue-500' : 'hover:bg-gray-500'}`}>
			Conditional with invalid variant
		</div>
	);
}

// ========================================
// COMPLEX REAL-WORLD SCENARIOS
// ========================================

/**
 * ❌ Invalid: Complex example with static, dynamic, and conditional classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-between, p-4, bg-blue-500, text-white, bg-gray-200, text-gray-800, rounded-lg]
 */
export function ComplexRealWorldScenario() {
	return (
		<div
			className={`flex items-center justify-between p-4 ${dynamicClass} ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} ${isDisabled ? 'opacity-50' : ''} rounded-lg invalid-class`}>
			Complex real-world scenario
		</div>
	);
}

/**
 * ✅ Valid: Button-like component with multiple conditionals
 * @validClasses [px-4, py-2, rounded, font-semibold, bg-blue-500, text-white, hover:bg-blue-600, bg-gray-300, text-gray-500, cursor-not-allowed, ring-2, ring-red-500]
 */
export function ButtonWithConditionals() {
	return (
		<button
			className={`px-4 py-2 rounded font-semibold ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} ${isError ? 'ring-2 ring-red-500' : ''}`}>
			Submit
		</button>
	);
}

/**
 * ❌ Invalid: Card component with various conditionals and invalid classes
 * @invalidClasses [invalid-shadow, invalid-border]
 * @validClasses [p-6, rounded-lg, bg-white, dark:bg-gray-800, shadow-lg, border, border-gray-200, dark:border-gray-700, border-red-500]
 */
export function CardWithConditionals() {
	return (
		<div
			className={`p-6 rounded-lg ${isActive ? 'bg-white dark:bg-gray-800 invalid-shadow' : 'bg-white'} ${isError ? 'border border-red-500' : 'border invalid-border dark:border-gray-700'}`}>
			Card content
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with conditional
 * @validClasses [w-full, h-auto, rounded, rounded-full]
 */
export function SelfClosingWithConditional() {
	return (
		<img
			className={`w-full h-auto ${isActive ? 'rounded' : 'rounded-full'}`}
			src="test.jpg"
			alt="test"
		/>
	);
}

/**
 * ❌ Invalid: Self-closing element with invalid class in conditional
 * @invalidClasses [invalid-rounded]
 * @validClasses [w-full, h-auto, rounded-full]
 */
export function SelfClosingInvalidConditional() {
	return (
		<img
			className={`w-full h-auto ${isActive ? 'invalid-rounded' : 'rounded-full'}`}
			src="test.jpg"
			alt="test"
		/>
	);
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Only conditional expression, no static classes
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function OnlyConditional() {
	return <div className={`${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>Only conditional</div>;
}

/**
 * ❌ Invalid: Conditional with whitespace and invalid classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ConditionalWithWhitespace() {
	return (
		<div className={`flex   ${isActive ? 'bg-blue-500' : 'bg-gray-500'}   invalid-class`}>
			Conditional with extra whitespace
		</div>
	);
}

/**
 * ✅ Valid: Parenthesized conditional expression
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ParenthesizedConditional() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
			Parenthesized conditional
		</div>
	);
}
