/**
 * Context: Mixed
 * Pattern: Complex
 *
 * Tests kitchen sink scenarios with complex nesting combining:
 * - Strings, arrays, objects, binary, ternary
 * - Multiple levels of nesting
 * - Examples from clsx documentation
 */
import { clsx } from 'clsx';

import { cn } from './utils';

const isActive = true;
const hasError = false;
const isLoading = false;

/**
 * ✅ Valid: Kitchen sink from clsx docs
 * Example: clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya')
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function KitchenSinkValid() {
	return (
		<div
			className={clsx(
				'flex',
				[1 && 'items-center', { 'justify-center': false, 'bg-blue-500': null }, ['text-white']],
				'text-white'
			)}>
			Kitchen sink
		</div>
	);
}

/**
 * ❌ Invalid: Kitchen sink with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-center, text-white]
 */
export function KitchenSinkInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				[1 && 'items-center', { 'justify-center': false, 'invalid-class': null }, ['text-white']],
				'text-white'
			)}>
			Invalid kitchen sink
		</div>
	);
}

/**
 * ✅ Valid: Mix of strings, binary, and nested arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function MixedStringsBinaryArrays() {
	return (
		<div
			className={cn(
				'flex',
				isActive && 'items-center',
				[['justify-center', 'bg-blue-500']],
				'text-white'
			)}>
			Mixed types
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in nested array
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, justify-center]
 */
export function MixedStringsBinaryArraysInvalidNested() {
	return (
		<div
			className={cn(
				'flex',
				isActive && 'items-center',
				[['justify-center', 'invalid-nested']],
				'text-white'
			)}>
			Invalid nested
		</div>
	);
}

/**
 * ✅ Valid: Mix of ternary, objects, and arrays
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500, justify-center, text-white]
 */
export function MixedTernaryObjectsArrays() {
	return (
		<div
			className={clsx(
				isActive ? 'flex' : 'grid',
				{ 'items-center': true, 'bg-blue-500': isActive, 'bg-gray-500': !isActive },
				['justify-center', 'text-white']
			)}>
			Mixed ternary objects arrays
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in ternary
 * @invalidClasses [invalid-grid]
 * @validClasses [flex, items-center, bg-blue-500, justify-center]
 */
export function MixedTernaryObjectsArraysInvalidTernary() {
	return (
		<div
			className={clsx(
				isActive ? 'flex' : 'invalid-grid',
				{ 'items-center': true, 'bg-blue-500': true },
				['justify-center']
			)}>
			Invalid ternary
		</div>
	);
}

/**
 * ✅ Valid: Nested objects with array values inside arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function NestedObjectsWithArraysInArrays() {
	return (
		<div
			className={cn([
				'flex',
				{ 'items-center': ['justify-center', 'bg-blue-500'] },
				[{ 'text-white': true, 'font-bold': isActive }]
			])}>
			Nested complex
		</div>
	);
}

/**
 * ❌ Invalid: Nested objects with arrays, invalid in nested array value
 * @invalidClasses [invalid-bg]
 * @validClasses [flex, items-center, justify-center, text-white]
 */
export function NestedObjectsWithArraysInArraysInvalid() {
	return (
		<div
			className={cn([
				'flex',
				{ 'items-center': ['justify-center', 'invalid-bg'] },
				[{ 'text-white': true }]
			])}>
			Invalid nested
		</div>
	);
}

/**
 * ✅ Valid: Multiple levels of nesting with all patterns
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, hover:bg-red-500]
 */
export function DeepComplexNesting() {
	return (
		<div
			className={clsx('flex', [
				isActive && 'items-center',
				[
					['justify-center', isActive ? 'bg-blue-500' : 'bg-gray-500'],
					{ 'text-white': true, 'font-bold': ['hover:bg-red-500'] }
				]
			])}>
			Deep complex
		</div>
	);
}

/**
 * ❌ Invalid: Deep complex nesting with invalid
 * @invalidClasses [invalid-deep]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function DeepComplexNestingInvalid() {
	return (
		<div
			className={clsx('flex', [
				isActive && 'items-center',
				[
					['justify-center', isActive ? 'bg-blue-500' : 'bg-gray-500'],
					{ 'text-white': true, 'font-bold': ['invalid-deep'] }
				]
			])}>
			Invalid deep
		</div>
	);
}

/**
 * ✅ Valid: Binary and ternary mixed in nested structures
 * @validClasses [flex, items-center, justify-center, bg-blue-500, bg-red-500, text-white]
 */
export function MixedBinaryTernaryNested() {
	return (
		<div
			className={cn(
				[hasError && 'flex'],
				{ 'items-center': [isActive ? 'justify-center' : 'justify-start', 'bg-blue-500'] },
				hasError && [isLoading ? 'bg-red-500' : 'bg-green-500', 'text-white']
			)}>
			Mixed binary ternary
		</div>
	);
}

/**
 * ❌ Invalid: Mixed binary ternary with invalid
 * @invalidClasses [invalid-start]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, bg-red-500]
 */
export function MixedBinaryTernaryNestedInvalid() {
	return (
		<div
			className={cn(
				[hasError && 'flex'],
				{ 'items-center': [isActive ? 'justify-center' : 'invalid-start', 'bg-blue-500'] },
				hasError && [isLoading ? 'bg-red-500' : 'bg-green-500']
			)}>
			Invalid mixed
		</div>
	);
}

/**
 * ✅ Valid: Variadic arrays with objects and nested arrays (clsx docs pattern)
 * Example: clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]])
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function VariadicComplexValid() {
	return (
		<div
			className={cn(
				['flex'],
				['', 0, false, 'items-center'],
				[['justify-center', [['bg-blue-500'], 'text-white']]],
				'font-bold'
			)}>
			Variadic complex
		</div>
	);
}

/**
 * ❌ Invalid: Variadic complex with invalid
 * @invalidClasses [invalid-variadic]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, font-bold]
 */
export function VariadicComplexInvalid() {
	return (
		<div
			className={cn(
				['flex'],
				['items-center'],
				[['justify-center', [['bg-blue-500'], 'invalid-variadic']]],
				'font-bold'
			)}>
			Invalid variadic
		</div>
	);
}

/**
 * ✅ Valid: Multiple objects with mixed nested structures
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, p-4]
 */
export function MultipleObjectsMixedNesting() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': [{ 'text-white': true, 'font-bold': isActive }] },
				'p-4'
			)}>
			Multiple objects mixed
		</div>
	);
}

/**
 * ❌ Invalid: Multiple objects mixed nesting with invalid
 * @invalidClasses [invalid-font]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, p-4]
 */
export function MultipleObjectsMixedNestingInvalid() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': [{ 'text-white': true, 'invalid-font': isActive }] },
				'p-4'
			)}>
			Invalid multiple objects
		</div>
	);
}

/**
 * ✅ Valid: Extreme nesting (5+ levels)
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ExtremeNesting() {
	return (
		<div className={cn([[[[[['flex', 'items-center'], ['justify-center']], 'bg-blue-500']]]])}>
			Extreme nesting
		</div>
	);
}

/**
 * ❌ Invalid: Extreme nesting with invalid
 * @invalidClasses [invalid-extreme]
 * @validClasses [flex, items-center, justify-center]
 */
export function ExtremeNestingInvalid() {
	return (
		<div className={cn([[[[[['flex', 'items-center'], ['invalid-extreme']], 'justify-center']]]])}>
			Invalid extreme
		</div>
	);
}

/**
 * ✅ Valid: All patterns combined (strings, binary, ternary, objects, arrays, nested)
 * @validClasses [flex, items-center, justify-center, bg-blue-500, bg-gray-500, text-white, font-bold, p-4, hover:bg-red-500]
 */
export function AllPatternsCombined() {
	return (
		<div
			className={clsx(
				'flex',
				isActive && 'items-center',
				hasError ? 'justify-center' : 'justify-start',
				{ 'bg-blue-500': isActive, 'bg-gray-500': !isActive },
				['text-white', { 'font-bold': ['p-4', isActive && 'hover:bg-red-500'] }]
			)}>
			All patterns
		</div>
	);
}

/**
 * ❌ Invalid: All patterns combined with invalid
 * @invalidClasses [invalid-all]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, p-4]
 */
export function AllPatternsCombinedInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive && 'items-center',
				hasError ? 'justify-center' : 'justify-start',
				{ 'bg-blue-500': isActive },
				['text-white', { 'font-bold': ['p-4', isActive && 'invalid-all'] }]
			)}>
			Invalid all patterns
		</div>
	);
}

/**
 * ✅ Valid: Nested function calls with complex structures
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function NestedFunctionsComplex() {
	return (
		<div
			className={cn(clsx('flex', { 'items-center': ['justify-center'] }), [
				clsx({ 'bg-blue-500': true }),
				'text-white'
			])}>
			Nested functions
		</div>
	);
}

/**
 * ❌ Invalid: Nested function calls with invalid
 * @invalidClasses [invalid-nested-fn]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedFunctionsComplexInvalid() {
	return (
		<div
			className={cn(clsx('flex', { 'items-center': ['justify-center'] }), [
				clsx({ 'bg-blue-500': true }),
				'invalid-nested-fn'
			])}>
			Invalid nested fn
		</div>
	);
}

/**
 * ✅ Valid: With Tailwind variants in complex nesting
 * @validClasses [flex, hover:bg-blue-500, md:flex-col, lg:items-center, dark:text-white, sm:justify-center]
 */
export function ComplexWithVariants() {
	return (
		<div
			className={clsx(
				['flex', isActive && 'hover:bg-blue-500'],
				{ 'md:flex-col': ['lg:items-center', 'dark:text-white'] },
				[['sm:justify-center']]
			)}>
			Complex with variants
		</div>
	);
}

/**
 * ✅ Valid: With arbitrary values in complex nesting
 * @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000], p-[20px]]
 */
export function ComplexWithArbitrary() {
	return (
		<div className={clsx('flex', { 'h-[50vh]': ['w-[100px]', 'bg-[#ff0000]'] }, [['p-[20px]']])}>
			Complex with arbitrary
		</div>
	);
}
