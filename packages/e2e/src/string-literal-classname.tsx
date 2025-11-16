/**
 * E2E Test: String Literal className Attributes
 *
 * Tests validation of: className="..."
 */
import React from 'react';

// ========================================
// SINGLE CLASS TESTS
// ========================================

// ✅ Valid: Single valid class
export function SingleClassValid() {
	return <div className="flex">Single valid class</div>;
}

// ❌ Invalid: Single invalid class
export function SingleClassInvalid() {
	return <div className="invalidclass">Single invalid class</div>;
}

// ========================================
// MULTIPLE CLASSES TESTS
// ========================================

// ✅ Valid: Multiple valid classes
export function MultipleClassesAllValid() {
	return <div className="flex items-center justify-center">All valid classes</div>;
}

// ❌ Invalid: All classes are invalid
export function MultipleClassesAllInvalid() {
	return <div className="badclass anotherBad wrongClass">All invalid classes</div>;
}

// ❌ Invalid: Mix of valid and invalid classes
export function MultipleClassesMixed() {
	return <div className="flex invalidclass items-center badone">Mixed valid and invalid</div>;
}

// ❌ Invalid: Invalid class at the beginning
export function MultipleClassesInvalidFirst() {
	return <div className="invalidclass flex items-center">Invalid first</div>;
}

// ❌ Invalid: Invalid class at the end
export function MultipleClassesInvalidLast() {
	return <div className="flex items-center invalidclass">Invalid last</div>;
}

// ❌ Invalid: Invalid class in the middle
export function MultipleClassesInvalidMiddle() {
	return <div className="flex invalidclass items-center">Invalid middle</div>;
}

// ========================================
// EDGE CASES
// ========================================

// ✅ Valid: Empty className
export function EmptyClassName() {
	return <div className="">Empty className</div>;
}

// ✅ Valid: Classes with extra spaces
export function ExtraSpaces() {
	return (
		<div className="flex  items-center   justify-center">Extra spaces (should be normalized)</div>
	);
}

// ========================================
// TAILWIND FEATURES
// ========================================

// ✅ Valid: Arbitrary values
export function ArbitraryValues() {
	return (
		<div className="h-[50vh] w-[100px] bg-[#ff0000]">
			<p className="p-[20px] text-[14px]">Arbitrary values</p>
		</div>
	);
}

// ✅ Valid: Classes with variants (hover, focus, etc.)
export function StateVariants() {
	return <div className="hover:bg-blue-500 focus:ring-2 active:scale-95">State variants</div>;
}

// ✅ Valid: Responsive variants
export function ResponsiveVariants() {
	return <div className="sm:flex md:grid lg:grid-cols-3 xl:grid-cols-4">Responsive variants</div>;
}

// ✅ Valid: Dark mode variants
export function DarkModeVariants() {
	return (
		<div className="bg-white dark:bg-gray-900 text-black dark:text-white">Dark mode variants</div>
	);
}

// ✅ Valid: Combined variants
export function CombinedVariants() {
	return (
		<div className="md:hover:bg-blue-500 lg:focus:ring-2 dark:md:text-white">Combined variants</div>
	);
}

// ❌ Invalid: Invalid variant name
export function InvalidVariantName() {
	return <div className="invalidvariant:bg-blue-500">Invalid variant</div>;
}

// ❌ Invalid: Invalid class with valid variant
export function InvalidClassWithValidVariant() {
	return <div className="hover:invalidclass">Invalid class with valid variant</div>;
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

// Mixed: Multiple elements with different validation results
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className="validclass">Invalid in first child</div>
			<div className="flex items-center">Valid in second child</div>
			<div className="container mx-auto badclass">Invalid in third child</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

// ✅ Valid: Self-closing element with valid classes
export function SelfClosingValid() {
	return <img className="w-full h-auto" src="test.jpg" alt="test" />;
}

// ❌ Invalid: Self-closing element with invalid class
export function SelfClosingInvalid() {
	return <img className="invalidclass w-full" src="test.jpg" alt="test" />;
}
