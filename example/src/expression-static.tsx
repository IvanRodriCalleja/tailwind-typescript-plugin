/**
 * E2E Test: Expression Static
 * Context: expression (JSX expression)
 * Pattern: static (string literal in braces)
 *
 * Tests validation of: className={'...'}
 */

// ========================================
// SINGLE CLASS TESTS
// ========================================

/**
 * ✅ Valid: Single valid class
 * @validClasses [flex]
 */
export function SingleClassValid() {
	return <div className={'flex'}>Single valid class</div>;
}

/**
 * ❌ Invalid: Single invalid class
 * @invalidClasses [invalidclass]
 */
export function SingleClassInvalid() {
	return <div className={'invalidclass'}>Single invalid class</div>;
}

// ========================================
// MULTIPLE CLASSES TESTS
// ========================================

/**
 * ✅ Valid: Multiple valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleClassesAllValid() {
	return <div className={'flex items-center justify-center'}>All valid classes</div>;
}

/**
 * ❌ Invalid: All classes are invalid
 * @invalidClasses [badclass, anotherBad, wrongClass]
 */
export function MultipleClassesAllInvalid() {
	return <div className={'badclass anotherBad wrongClass'}>All invalid classes</div>;
}

/**
 * ❌ Invalid: Mix of valid and invalid classes
 * @invalidClasses [invalidclass, badone]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesMixed() {
	return <div className={'flex invalidclass items-center badone'}>Mixed valid and invalid</div>;
}

/**
 * ❌ Invalid: Invalid class at the beginning
 * @invalidClasses [invalidclass]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesInvalidFirst() {
	return <div className={'invalidclass flex items-center'}>Invalid first</div>;
}

/**
 * ❌ Invalid: Invalid class at the end
 * @invalidClasses [invalidclass]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesInvalidLast() {
	return <div className={'flex items-center invalidclass'}>Invalid last</div>;
}

/**
 * ❌ Invalid: Invalid class in the middle
 * @invalidClasses [invalidclass]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesInvalidMiddle() {
	return <div className={'flex invalidclass items-center'}>Invalid middle</div>;
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Empty className
 */
export function EmptyClassName() {
	return <div className={''}>Empty className</div>;
}

/**
 * ✅ Valid: Classes with extra spaces
 * @validClasses [flex, items-center, justify-center]
 */
export function ExtraSpaces() {
	return (
		<div className={'flex  items-center   justify-center'}>Extra spaces (should be normalized)</div>
	);
}

// ========================================
// TAILWIND FEATURES
// ========================================

/**
 * ✅ Valid: Arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000], p-[20px], text-[14px]]
 */
export function ArbitraryValues() {
	return (
		<div className={'h-[50vh] w-[100px] bg-[#ff0000]'}>
			<p className={'p-[20px] text-[14px]'}>Arbitrary values</p>
		</div>
	);
}

/**
 * ✅ Valid: Classes with variants (hover, focus, etc.)
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function StateVariants() {
	return <div className={'hover:bg-blue-500 focus:ring-2 active:scale-95'}>State variants</div>;
}

/**
 * ✅ Valid: Responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3, xl:grid-cols-4]
 */
export function ResponsiveVariants() {
	return <div className={'sm:flex md:grid lg:grid-cols-3 xl:grid-cols-4'}>Responsive variants</div>;
}

/**
 * ✅ Valid: Dark mode variants
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function DarkModeVariants() {
	return (
		<div className={'bg-white dark:bg-gray-900 text-black dark:text-white'}>Dark mode variants</div>
	);
}

/**
 * ✅ Valid: Combined variants
 * @validClasses [md:hover:bg-blue-500, lg:focus:ring-2, dark:md:text-white]
 */
export function CombinedVariants() {
	return (
		<div className={'md:hover:bg-blue-500 lg:focus:ring-2 dark:md:text-white'}>
			Combined variants
		</div>
	);
}

/**
 * ❌ Invalid: Invalid variant name
 * @invalidClasses [invalidvariant:bg-blue-500]
 */
export function InvalidVariantName() {
	return <div className={'invalidvariant:bg-blue-500'}>Invalid variant</div>;
}

/**
 * ❌ Invalid: Invalid class with valid variant
 * @invalidClasses [hover:invalidclass]
 */
export function InvalidClassWithValidVariant() {
	return <div className={'hover:invalidclass'}>Invalid class with valid variant</div>;
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid class
 * @invalidClasses {1} [validclass]
 * @element {2} Second child with all valid classes
 * @validClasses {2} [flex, items-center]
 * @element {3} Third child with mixed valid and invalid classes
 * @invalidClasses {3} [badclass]
 * @validClasses {3} [container, mx-auto]
 */
export function MultipleElements() {
	return (
		<div className={'flex flex-col'}>
			<div className={'validclass'}>Invalid in first child</div>
			<div className={'flex items-center'}>Valid in second child</div>
			<div className={'container mx-auto badclass'}>Invalid in third child</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with valid classes
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingValid() {
	return <img className={'w-full h-auto'} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid class
 * @invalidClasses [invalidclass]
 * @validClasses [w-full]
 */
export function SelfClosingInvalid() {
	return <img className={'invalidclass w-full'} src="test.jpg" alt="test" />;
}

// ========================================
// COMPARISON WITH STRING LITERAL
// ========================================

// These should behave identically to string literals
export function BehaviorComparison() {
	return (
		<>
			{/* Both should show same errors */}
			<div className="flex invalidclass">String literal</div>
			<div className={'flex invalidclass'}>JSX expression</div>
		</>
	);
}
