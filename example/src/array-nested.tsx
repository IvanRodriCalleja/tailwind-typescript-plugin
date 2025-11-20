/**
 * Context: Array
 * Pattern: Nested
 *
 * Tests nested array structures like:
 * - clsx([['foo', 'bar']])
 * - clsx([['foo'], ['bar']])
 * - clsx([[['deeply', 'nested']]])
 */

import { clsx } from 'clsx';
import { cn } from './utils';

/**
 * ✅ Valid: Single level nested array, all valid
 * @validClasses [flex, items-center]
 */
export function NestedArraySingleLevelValid() {
	return <div className={cn([['flex', 'items-center']])}>Single level nested</div>;
}

/**
 * ❌ Invalid: Single level nested array, invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function NestedArraySingleLevelInvalid() {
	return <div className={cn([['flex', 'invalid-class']])}>Invalid nested</div>;
}

/**
 * ✅ Valid: Two nested arrays at same level
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayTwoGroupsValid() {
	return <div className={cn([['flex', 'items-center'], ['justify-center', 'bg-blue-500']])}>Two groups</div>;
}

/**
 * ❌ Invalid: Two nested arrays, invalid in second
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayTwoGroupsInvalidSecond() {
	return <div className={cn([['flex', 'items-center'], ['justify-center', 'invalid-class']])}>Invalid in second</div>;
}

/**
 * ❌ Invalid: Two nested arrays, invalid in first
 * @invalidClasses [invalid-error]
 * @validClasses [items-center, justify-center, bg-blue-500]
 */
export function NestedArrayTwoGroupsInvalidFirst() {
	return <div className={cn([['invalid-error', 'items-center'], ['justify-center', 'bg-blue-500']])}>Invalid in first</div>;
}

/**
 * ✅ Valid: Deeply nested arrays (3 levels)
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayDeepValid() {
	return <div className={cn([[['flex', 'items-center', 'justify-center']]])}>Deeply nested</div>;
}

/**
 * ❌ Invalid: Deeply nested arrays with invalid class
 * @invalidClasses [invalid-deep]
 * @validClasses [flex, items-center]
 */
export function NestedArrayDeepInvalid() {
	return <div className={cn([[['flex', 'invalid-deep', 'items-center']]])}>Invalid deep nested</div>;
}

/**
 * ✅ Valid: Mixed flat and nested arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayMixedValid() {
	return <div className={cn(['flex', ['items-center', 'justify-center'], 'bg-blue-500'])}>Mixed nesting</div>;
}

/**
 * ❌ Invalid: Mixed flat and nested, invalid in nested
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function NestedArrayMixedInvalidNested() {
	return <div className={cn(['flex', ['items-center', 'invalid-nested'], 'bg-blue-500'])}>Invalid in nested</div>;
}

/**
 * ❌ Invalid: Mixed flat and nested, invalid in flat
 * @invalidClasses [invalid-flat]
 * @validClasses [items-center, justify-center, bg-blue-500]
 */
export function NestedArrayMixedInvalidFlat() {
	return <div className={cn(['invalid-flat', ['items-center', 'justify-center'], 'bg-blue-500'])}>Invalid in flat</div>;
}

/**
 * ✅ Valid: Complex nesting like clsx documentation
 * Example: [['baz', [['hello'], 'there']]]
 * @validClasses [flex, items-center, justify-center, text-lg]
 */
export function NestedArrayComplexValid() {
	return <div className={cn([['flex', [['items-center'], 'justify-center']], 'text-lg'])}>Complex nesting</div>;
}

/**
 * ❌ Invalid: Complex nesting with invalid class
 * @invalidClasses [invalid-complex]
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayComplexInvalid() {
	return <div className={cn([['flex', [['items-center'], 'invalid-complex']], 'justify-center'])}>Invalid complex</div>;
}

/**
 * ✅ Valid: Nested arrays with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:flex-col, lg:items-center]
 */
export function NestedArrayWithVariants() {
	return <div className={cn([['flex', 'hover:bg-blue-500'], ['md:flex-col', 'lg:items-center']])}>With variants</div>;
}

/**
 * ✅ Valid: Nested arrays with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function NestedArrayWithArbitrary() {
	return <div className={cn([['flex', 'h-[50vh]'], ['w-[100px]', 'bg-[#ff0000]']])}>With arbitrary</div>;
}

/**
 * ✅ Valid: Empty nested arrays
 * @validClasses [flex]
 */
export function NestedArrayEmpty() {
	return <div className={cn([[], 'flex', [[]]])}>Empty nested arrays</div>;
}

/**
 * ✅ Valid: Very deeply nested (4+ levels)
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayVeryDeep() {
	return <div className={cn([[[[['flex', 'items-center', 'justify-center']]]]])}>Very deep</div>;
}

/**
 * ✅ Valid: Multiple variadic nested arrays (like clsx docs)
 * Example: clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]])
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function NestedArrayVariadic() {
	return (
		<div className={cn(['flex'], ['', 0, false, 'items-center'], [['justify-center', [['bg-blue-500'], 'text-white']]])}>
			Variadic nested
		</div>
	);
}

/**
 * ❌ Invalid: Variadic nested arrays with invalid
 * @invalidClasses [invalid-variadic]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayVariadicInvalid() {
	return (
		<div className={cn(['flex'], ['items-center'], [['justify-center', [['bg-blue-500'], 'invalid-variadic']]])}>
			Invalid variadic
		</div>
	);
}

/**
 * ✅ Valid: Nested arrays in different utility functions
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayDifferentFunctions() {
	return (
		<>
			<div className={clsx([['flex', 'items-center']])}>clsx nested</div>
			<div className={cn([['justify-center']])}>cn nested</div>
		</>
	);
}

/**
 * ✅ Valid: Nested function calls with nested arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayNestedFunctions() {
	return <div className={cn([clsx([['flex', 'items-center']]), ['justify-center', 'bg-blue-500']])}>Nested functions</div>;
}

/**
 * ❌ Invalid: Nested function calls with nested arrays and invalid
 * @invalidClasses [invalid-nested-fn]
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayNestedFunctionsInvalid() {
	return <div className={cn([clsx([['flex', 'invalid-nested-fn']]), ['items-center', 'justify-center']])}>Invalid nested fn</div>;
}
