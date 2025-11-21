/**
 * E2E Test: Array Static
 * Context: array (array literal)
 * Pattern: static (string literal elements)
 *
 * Tests validation of: className={cn(['flex', 'items-center'])}
 */

// ========================================
// SINGLE ELEMENT ARRAYS
// ========================================

/**
 * ✅ Valid: Single element array with valid class
 * @validClasses [flex]
 */
export function SingleElementValid() {
	return <div className={cn(['flex'])}>Single element array</div>;
}

/**
 * ❌ Invalid: Single element array with invalid class
 * @invalidClasses [invalid-class]
 */
export function SingleElementInvalid() {
	return <div className={cn(['invalid-class'])}>Single element invalid</div>;
}

/**
 * ✅ Valid: Single element with multiple classes
 * @validClasses [flex, items-center, justify-center]
 */
export function SingleElementMultipleClasses() {
	return (
		<div className={cn(['flex items-center justify-center'])}>Multiple classes in one element</div>
	);
}

/**
 * ❌ Invalid: Single element with mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function SingleElementMixedClasses() {
	return <div className={cn(['flex invalid-class items-center'])}>Mixed classes</div>;
}

// ========================================
// MULTIPLE ELEMENT ARRAYS
// ========================================

/**
 * ✅ Valid: Multiple elements with valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleElementsAllValid() {
	return (
		<div className={cn(['flex', 'items-center', 'justify-center'])}>Multiple valid elements</div>
	);
}

/**
 * ❌ Invalid: Multiple elements, all invalid
 * @invalidClasses [invalid-one, invalid-two, invalid-three]
 */
export function MultipleElementsAllInvalid() {
	return <div className={cn(['invalid-one', 'invalid-two', 'invalid-three'])}>All invalid</div>;
}

/**
 * ❌ Invalid: Multiple elements with mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MultipleElementsMixed() {
	return <div className={cn(['flex', 'invalid-class', 'items-center'])}>Mixed elements</div>;
}

/**
 * ❌ Invalid: Invalid in first element
 * @invalidClasses [invalid-first]
 * @validClasses [items-center, justify-center]
 */
export function InvalidInFirstElement() {
	return (
		<div className={cn(['invalid-first', 'items-center', 'justify-center'])}>Invalid first</div>
	);
}

/**
 * ❌ Invalid: Invalid in last element
 * @invalidClasses [invalid-last]
 * @validClasses [flex, items-center]
 */
export function InvalidInLastElement() {
	return <div className={cn(['flex', 'items-center', 'invalid-last'])}>Invalid last</div>;
}

/**
 * ❌ Invalid: Invalid in middle element
 * @invalidClasses [invalid-middle]
 * @validClasses [flex, justify-center]
 */
export function InvalidInMiddleElement() {
	return <div className={cn(['flex', 'invalid-middle', 'justify-center'])}>Invalid middle</div>;
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Empty array
 */
export function EmptyArray() {
	return <div className={cn([])}>Empty array</div>;
}

/**
 * ✅ Valid: Array with empty string element
 * @validClasses [flex, items-center]
 */
export function ArrayWithEmptyString() {
	return <div className={cn(['flex', '', 'items-center'])}>Array with empty string</div>;
}

/**
 * ✅ Valid: Elements with multiple spaces
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleSpacesInElements() {
	return <div className={cn(['flex  items-center', 'justify-center'])}>Multiple spaces</div>;
}

// ========================================
// TAILWIND FEATURES
// ========================================

/**
 * ✅ Valid: Array with arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ArrayWithArbitraryValues() {
	return (
		<div className={cn(['h-[50vh]', 'w-[100px]', 'bg-[#ff0000]'])}>Array with arbitrary values</div>
	);
}

/**
 * ✅ Valid: Array with variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function ArrayWithVariants() {
	return (
		<div className={cn(['hover:bg-blue-500', 'focus:ring-2', 'active:scale-95'])}>
			Array with variants
		</div>
	);
}

/**
 * ✅ Valid: Array with responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3]
 */
export function ArrayWithResponsiveVariants() {
	return <div className={cn(['sm:flex', 'md:grid', 'lg:grid-cols-3'])}>Array with responsive</div>;
}

/**
 * ✅ Valid: Array with dark mode variants
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function ArrayWithDarkMode() {
	return (
		<div className={cn(['bg-white dark:bg-gray-900', 'text-black dark:text-white'])}>
			Array with dark mode
		</div>
	);
}

/**
 * ❌ Invalid: Array with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function ArrayWithInvalidVariant() {
	return <div className={cn(['flex', 'invalid-variant:bg-blue'])}>Array with invalid variant</div>;
}

/**
 * ❌ Invalid: Array with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], w-[100px]]
 */
export function ArrayWithArbitraryAndInvalid() {
	return (
		<div className={cn(['h-[50vh]', 'invalid-size', 'w-[100px]'])}>
			Array with arbitrary and invalid
		</div>
	);
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Array in clsx() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ArrayInClsxFunction() {
	return <div className={clsx(['flex', 'items-center', 'justify-center'])}>Array in clsx()</div>;
}

/**
 * ❌ Invalid: Array in clsx() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ArrayInClsxFunctionInvalid() {
	return (
		<div className={clsx(['flex', 'invalid-class', 'items-center'])}>Array in clsx() invalid</div>
	);
}

/**
 * ✅ Valid: Array in classNames() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ArrayInClassNamesFunction() {
	return (
		<div className={classNames(['flex', 'items-center', 'justify-center'])}>
			Array in classNames()
		</div>
	);
}

/**
 * ❌ Invalid: Array in classNames() with invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ArrayInClassNamesFunctionInvalid() {
	return (
		<div className={classNames(['flex', 'invalid-class', 'items-center'])}>
			Array in classNames() invalid
		</div>
	);
}

// ========================================
// NESTED FUNCTION CALLS WITH ARRAYS
// ========================================

/**
 * ✅ Valid: Nested function calls with arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedFunctionCallsWithArrays() {
	return (
		<div className={clsx('flex', cn(['items-center', 'justify-center']), 'bg-blue-500')}>
			Nested with arrays
		</div>
	);
}

/**
 * ❌ Invalid: Nested function calls with invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function NestedFunctionCallsWithArraysInvalid() {
	return (
		<div className={clsx('flex', cn(['items-center', 'invalid-class']), 'bg-blue-500')}>
			Nested with invalid
		</div>
	);
}

/**
 * ✅ Valid: Nested arrays
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrays() {
	return <div className={cn([cn(['flex', 'items-center']), 'justify-center'])}>Nested arrays</div>;
}

// ========================================
// MIXED WITH OTHER PATTERNS
// ========================================

/**
 * ✅ Valid: Array with static strings in function
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ArrayWithStaticStrings() {
	return (
		<div className={cn('flex', ['items-center', 'justify-center'], 'bg-blue-500')}>
			Array with static
		</div>
	);
}

/**
 * ❌ Invalid: Array with static strings, invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ArrayWithStaticStringsInvalid() {
	return (
		<div className={cn('flex', ['items-center', 'invalid-class'], 'bg-blue-500')}>
			Array with static invalid
		</div>
	);
}

// ========================================
// MULTIPLE JSX ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in array
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, items-center, justify-center]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, items-center]
 */
export function MultipleJsxElements() {
	return (
		<div className="flex flex-col">
			<div className={cn(['flex', 'invalid-error'])}>Invalid in first child</div>
			<div className={cn(['flex', 'items-center', 'justify-center'])}>Valid in second child</div>
			<div className={cn(['flex', 'items-center', 'invalid-class'])}>Invalid in third child</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with array
 * @validClasses [w-full, h-auto, rounded-lg]
 */
export function SelfClosingWithArray() {
	return <img className={cn(['w-full', 'h-auto', 'rounded-lg'])} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingWithArrayInvalid() {
	return <img className={cn(['w-full', 'invalid-class', 'h-auto'])} src="test.jpg" alt="test" />;
}

// ========================================
// MEMBER EXPRESSIONS WITH ARRAYS
// ========================================

/**
 * ✅ Valid: Member expression with array
 * @validClasses [flex, items-center, justify-center]
 */
export function MemberExpressionWithArray() {
	return (
		<div className={utils.cn(['flex', 'items-center', 'justify-center'])}>Member with array</div>
	);
}

/**
 * ❌ Invalid: Member expression with invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MemberExpressionWithArrayInvalid() {
	return (
		<div className={utils.cn(['flex', 'invalid-class', 'items-center'])}>Member with invalid</div>
	);
}

// ========================================
// UNKNOWN FUNCTIONS (should be ignored)
// ========================================

/**
 * ✅ Valid: Unknown function with array (ignored, not validated)
 */
export function UnknownFunctionWithArray() {
	return (
		<div className={unknownBuilder(['flex', 'totally-invalid', 'items-center'])}>
			Unknown function ignored
		</div>
	);
}

// ========================================
// CUSTOM UTILITY FUNCTIONS
// ========================================

/**
 * ✅ Valid: Custom utility function with array
 * @utilityFunctions [myCustomBuilder]
 * @validClasses [flex, items-center, justify-center]
 */
export function CustomUtilityWithArray() {
	return (
		<div className={myCustomBuilder(['flex', 'items-center', 'justify-center'])}>
			Custom with array
		</div>
	);
}

// ========================================
// TRAILING COMMAS
// ========================================

/**
 * ✅ Valid: Array with trailing comma
 * @validClasses [flex, items-center, justify-center]
 */
export function ArrayWithTrailingComma() {
	return <div className={cn(['flex', 'items-center', 'justify-center'])}>Trailing comma</div>;
}

// Mock function declarations
declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function clsx(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function classNames(...args: (string | string[] | boolean | null | undefined)[]): string;
declare function unknownBuilder(...args: (string | string[])[]): string;
declare function myCustomBuilder(...args: (string | string[])[]): string;

declare const utils: {
	cn(...args: (string | string[])[]): string;
};
