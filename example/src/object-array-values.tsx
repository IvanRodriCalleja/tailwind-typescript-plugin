/**
 * Context: Object
 * Pattern: Array Values
 *
 * Tests object literals with arrays as property values:
 * - clsx({ foo: ['bar', 'baz'] })
 * - clsx({ foo: ['bar'], baz: ['qux'] })
 * - clsx({ foo: [['nested']] })
 */
import { clsx } from 'clsx';

import { cn } from './utils';

const isActive = true;
const hasError = false;

/**
 * ✅ Valid: Object with array value, all valid
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectArrayValueValid() {
	return <div className={clsx({ flex: ['items-center', 'justify-center'] })}>Array value</div>;
}

/**
 * ❌ Invalid: Object with array value, invalid class in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectArrayValueInvalid() {
	return <div className={clsx({ flex: ['items-center', 'invalid-class'] })}>Invalid in array</div>;
}

/**
 * ✅ Valid: Multiple properties with array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function ObjectMultipleArrayValues() {
	return (
		<div
			className={clsx({ flex: ['items-center', 'justify-center'], 'bg-blue-500': ['text-white'] })}>
			Multiple arrays
		</div>
	);
}

/**
 * ❌ Invalid: Multiple properties with array values, invalid in second
 * @invalidClasses [invalid-text]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectMultipleArrayValuesInvalidSecond() {
	return (
		<div
			className={clsx({
				flex: ['items-center', 'justify-center'],
				'bg-blue-500': ['invalid-text']
			})}>
			Invalid in second
		</div>
	);
}

/**
 * ❌ Invalid: Multiple properties with array values, invalid in first
 * @invalidClasses [invalid-flex]
 * @validClasses [items-center, bg-blue-500, text-white]
 */
export function ObjectMultipleArrayValuesInvalidFirst() {
	return (
		<div
			className={clsx({ flex: ['invalid-flex', 'items-center'], 'bg-blue-500': ['text-white'] })}>
			Invalid in first
		</div>
	);
}

/**
 * ✅ Valid: Nested arrays as object values
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectNestedArrayValue() {
	return (
		<div className={clsx({ flex: [['items-center', 'justify-center']], 'bg-blue-500': true })}>
			Nested array value
		</div>
	);
}

/**
 * ❌ Invalid: Nested arrays as object values with invalid
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectNestedArrayValueInvalid() {
	return (
		<div className={clsx({ flex: [['items-center', 'invalid-nested']], 'justify-center': true })}>
			Invalid nested
		</div>
	);
}

/**
 * ✅ Valid: Mix of boolean and array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
export function ObjectMixedBooleanAndArray() {
	return (
		<div
			className={clsx({
				flex: true,
				'items-center': ['justify-center', 'bg-blue-500'],
				'text-white': true
			})}>
			Mixed types
		</div>
	);
}

/**
 * ❌ Invalid: Mix of boolean and array values with invalid
 * @invalidClasses [invalid-mix]
 * @validClasses [flex, items-center, justify-center, text-white]
 */
export function ObjectMixedBooleanAndArrayInvalid() {
	return (
		<div
			className={clsx({
				flex: true,
				'items-center': ['justify-center', 'invalid-mix'],
				'text-white': true
			})}>
			Invalid mixed
		</div>
	);
}

/**
 * ✅ Valid: Array value with binary expressions
 * @validClasses [flex, items-center, text-red-500]
 */
export function ObjectArrayValueWithBinary() {
	return (
		<div className={clsx({ flex: ['items-center', hasError && 'text-red-500'] })}>
			Array with binary
		</div>
	);
}

/**
 * ❌ Invalid: Array value with binary expressions and invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex, items-center]
 */
export function ObjectArrayValueWithBinaryInvalid() {
	return (
		<div className={clsx({ flex: ['items-center', hasError && 'invalid-error'] })}>
			Invalid binary in array
		</div>
	);
}

/**
 * ✅ Valid: Array value with ternary expressions
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500]
 */
export function ObjectArrayValueWithTernary() {
	return (
		<div className={clsx({ flex: ['items-center', isActive ? 'bg-blue-500' : 'bg-gray-500'] })}>
			Array with ternary
		</div>
	);
}

/**
 * ❌ Invalid: Array value with ternary and invalid class
 * @invalidClasses [invalid-active]
 * @validClasses [flex, items-center, bg-gray-500]
 */
export function ObjectArrayValueWithTernaryInvalid() {
	return (
		<div className={clsx({ flex: ['items-center', isActive ? 'invalid-active' : 'bg-gray-500'] })}>
			Invalid ternary
		</div>
	);
}

/**
 * ✅ Valid: Empty array as value
 * @validClasses [flex]
 */
export function ObjectEmptyArrayValue() {
	return <div className={clsx({ flex: [] })}>Empty array value</div>;
}

/**
 * ✅ Valid: Array with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:flex-col, dark:text-white]
 */
export function ObjectArrayValueWithVariants() {
	return (
		<div className={clsx({ flex: ['hover:bg-blue-500', 'md:flex-col', 'dark:text-white'] })}>
			With variants
		</div>
	);
}

/**
 * ✅ Valid: Array with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ObjectArrayValueWithArbitrary() {
	return (
		<div className={clsx({ flex: ['h-[50vh]', 'w-[100px]', 'bg-[#ff0000]'] })}>With arbitrary</div>
	);
}

/**
 * ✅ Valid: Deeply nested arrays as values
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectDeeplyNestedArrayValue() {
	return (
		<div className={clsx({ flex: [[['items-center', 'justify-center', 'bg-blue-500']]] })}>
			Deeply nested
		</div>
	);
}

/**
 * ❌ Invalid: Deeply nested arrays with invalid
 * @invalidClasses [invalid-deep]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectDeeplyNestedArrayValueInvalid() {
	return (
		<div className={clsx({ flex: [[['items-center', 'invalid-deep', 'justify-center']]] })}>
			Invalid deep
		</div>
	);
}

/**
 * ✅ Valid: Object inside array value
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectArrayValueWithNestedObject() {
	return (
		<div
			className={clsx({
				flex: ['items-center', { 'justify-center': true, 'bg-blue-500': isActive }]
			})}>
			Object in array
		</div>
	);
}

/**
 * ❌ Invalid: Object inside array value with invalid
 * @invalidClasses [invalid-nested-obj]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectArrayValueWithNestedObjectInvalid() {
	return (
		<div
			className={clsx({
				flex: ['items-center', { 'justify-center': true, 'invalid-nested-obj': isActive }]
			})}>
			Invalid object in array
		</div>
	);
}

/**
 * ✅ Valid: Multiple objects with array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function MultipleObjectsWithArrayValues() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': ['text-white', 'font-bold'] }
			)}>
			Multiple objects with arrays
		</div>
	);
}

/**
 * ❌ Invalid: Multiple objects with array values, invalid in second
 * @invalidClasses [invalid-text]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function MultipleObjectsWithArrayValuesInvalidSecond() {
	return (
		<div
			className={clsx(
				{ flex: ['items-center', 'justify-center'] },
				{ 'bg-blue-500': ['invalid-text'] }
			)}>
			Invalid in second
		</div>
	);
}

/**
 * ❌ Invalid: Multiple objects with array values, invalid in first
 * @invalidClasses [invalid-items]
 * @validClasses [flex, justify-center, bg-blue-500, text-white]
 */
export function MultipleObjectsWithArrayValuesInvalidFirst() {
	return (
		<div
			className={clsx(
				{ flex: ['invalid-items', 'justify-center'] },
				{ 'bg-blue-500': ['text-white'] }
			)}>
			Invalid in first
		</div>
	);
}

/**
 * ✅ Valid: Different utility functions
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectArrayValueDifferentFunctions() {
	return (
		<>
			<div className={clsx({ flex: ['items-center'] })}>clsx</div>
			<div className={cn({ 'justify-center': ['bg-blue-500'] })}>cn</div>
		</>
	);
}

/**
 * ✅ Valid: Nested function calls with object array values
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectArrayValueNestedFunctions() {
	return (
		<div className={cn([clsx({ flex: ['items-center', 'justify-center'] }), 'bg-blue-500'])}>
			Nested functions
		</div>
	);
}

/**
 * ❌ Invalid: Nested function calls with invalid in object array value
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ObjectArrayValueNestedFunctionsInvalid() {
	return (
		<div className={cn([clsx({ flex: ['items-center', 'invalid-nested'] }), 'bg-blue-500'])}>
			Invalid nested fn
		</div>
	);
}
