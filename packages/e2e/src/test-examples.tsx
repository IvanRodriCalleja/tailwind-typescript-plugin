/**
 * Test file for Tailwind className validation plugin
 *
 * This file demonstrates the plugin detecting invalid Tailwind classes
 * in JSX className attributes.
 */
import React from 'react';

// ✅ Valid: All classes are valid Tailwind classes
export function ValidExample() {
	return (
		<div className="flex items-center justify-center">
			<p className="text-lg font-bold text-blue-500">Hello World</p>
		</div>
	);
}

// ❌ Invalid: "holii" is not a valid Tailwind class
export function InvalidExample1() {
	return <div className="holii">Invalid class</div>;
}

// ❌ Invalid: "holii" is not valid, but "container" and "mx-auto" are valid
export function InvalidExample2() {
	return <div className="holii container mx-auto">Mixed classes</div>;
}

// ❌ Invalid: Multiple invalid classes
export function InvalidExample3() {
	return <div className="invalidclass another-bad-one flex items-center">Multiple errors</div>;
}

// ✅ Valid: Arbitrary values are supported
export function ArbitraryValuesExample() {
	return (
		<div className="h-[50vh] w-[100px] bg-[#ff0000]">
			<p className="p-[20px] text-[14px]">Custom values</p>
		</div>
	);
}

// ✅ Valid: Classes with variants
export function VariantsExample() {
	return (
		<div className="hover:bg-blue-500 md:flex lg:grid-cols-3 dark:text-white">
			Responsive and state variants
		</div>
	);
}

// ❌ Invalid: Invalid variant
export function InvalidVariant() {
	return <div className="invalidvariant:bg-blue-500">Bad variant</div>;
}

// ✅ Valid: JSX expression with string literal
export function JsxExpressionValid() {
	return <div className={'flex items-center'}>Valid in expression</div>;
}

// NOT IMPLEMENTED YET
// ❌ Invalid: JSX expression with invalid class
export function JsxExpressionInvalid() {
	return <div className={'badclass flex items-center'}>Invalid in expression</div>;
}

// NOT IMPLEMENTED YET
// Note: Dynamic classes (variables, template strings, etc.) won't be validated
// as they can't be statically analyzed
export function DynamicClasses({ isActive }: { isActive: boolean }) {
	// This won't be validated (dynamic)
	const dynamicClass = isActive ? 'bg-blue-500' : 'bg-gray-500';
	return <div className={dynamicClass}>Dynamic</div>;
}
