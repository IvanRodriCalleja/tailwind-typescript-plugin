/**
 * E2E Test: Object Static
 * Context: object (object literal)
 * Pattern: static (static keys with boolean/variable values)
 *
 * Tests validation of: className={clsx({ 'flex': true, 'items-center': isActive })}
 */

// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;
const hasError = false;

// ========================================
// STRING LITERAL KEYS
// ========================================

/**
 * ✅ Valid: Object with string literal keys, all valid
 * @validClasses [flex, items-center]
 */
export function ObjectStringKeysValid() {
	return <div className={clsx({ flex: true, 'items-center': true })}>Object with string keys</div>;
}

/**
 * ❌ Invalid: Object with string literal key, invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ObjectStringKeysInvalid() {
	return <div className={clsx({ flex: true, 'invalid-class': true })}>Invalid string key</div>;
}

/**
 * ❌ Invalid: Object with mix of valid and invalid string keys
 * @invalidClasses [invalid-center]
 * @validClasses [flex, items-start]
 */
export function ObjectStringKeysMixed() {
	return (
		<div className={clsx({ flex: true, 'invalid-center': true, 'items-start': true })}>
			Mixed keys
		</div>
	);
}

// ========================================
// IDENTIFIER KEYS (without quotes)
// ========================================

/**
 * ✅ Valid: Object with identifier keys, all valid
 * @validClasses [flex, items-center]
 */
export function ObjectIdentifierKeysValid() {
	return <div className={clsx({ flex: true, 'items-center': true })}>Identifier keys</div>;
}

/**
 * ❌ Invalid: Object with identifier key that would be invalid
 * Note: Identifier keys can't have hyphens, so this tests single-word invalid classes
 * @invalidClasses [invalidclass]
 * @validClasses [flex]
 */
export function ObjectIdentifierKeysInvalid() {
	return <div className={clsx({ flex: true, invalidclass: true })}>Invalid identifier key</div>;
}

// ========================================
// VALUES (boolean, variables)
// ========================================

/**
 * ✅ Valid: Object with boolean values
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectBooleanValues() {
	return (
		<div className={clsx({ flex: true, 'items-center': false, 'justify-center': true })}>
			Boolean values
		</div>
	);
}

/**
 * ✅ Valid: Object with variable values
 * @validClasses [flex, text-red-500, bg-gray-100]
 */
export function ObjectVariableValues() {
	return (
		<div className={clsx({ flex: true, 'text-red-500': hasError, 'bg-gray-100': isDisabled })}>
			Variable values
		</div>
	);
}

/**
 * ❌ Invalid: Object with invalid key and variable value
 * @invalidClasses [invalid-error]
 * @validClasses [flex, bg-gray-100]
 */
export function ObjectVariableValuesInvalid() {
	return (
		<div className={clsx({ flex: true, 'invalid-error': hasError, 'bg-gray-100': isDisabled })}>
			Invalid with variables
		</div>
	);
}

// ========================================
// MULTIPLE CLASSES IN ONE KEY
// ========================================

/**
 * ✅ Valid: Object key with multiple classes
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectMultipleClassesInKey() {
	return (
		<div className={clsx({ 'flex items-center justify-center': true })}>
			Multiple classes in key
		</div>
	);
}

/**
 * ❌ Invalid: Object key with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectMultipleClassesInKeyInvalid() {
	return (
		<div className={clsx({ 'flex invalid-class items-center': true })}>Multiple with invalid</div>
	);
}

// ========================================
// EMPTY OBJECT
// ========================================

/**
 * ✅ Valid: Empty object
 */
export function ObjectEmpty() {
	return <div className={clsx({})}>Empty object</div>;
}

// ========================================
// TAILWIND FEATURES
// ========================================

/**
 * ✅ Valid: Object with arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ObjectWithArbitraryValues() {
	return (
		<div className={clsx({ 'h-[50vh]': true, 'w-[100px]': true, 'bg-[#ff0000]': isActive })}>
			Arbitrary values
		</div>
	);
}

/**
 * ✅ Valid: Object with variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function ObjectWithVariants() {
	return (
		<div
			className={clsx({
				'hover:bg-blue-500': true,
				'focus:ring-2': true,
				'active:scale-95': isActive
			})}>
			Variants
		</div>
	);
}

/**
 * ✅ Valid: Object with responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3]
 */
export function ObjectWithResponsiveVariants() {
	return (
		<div className={clsx({ 'sm:flex': true, 'md:grid': true, 'lg:grid-cols-3': isActive })}>
			Responsive
		</div>
	);
}

/**
 * ✅ Valid: Object with dark mode variants
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function ObjectWithDarkMode() {
	return (
		<div
			className={clsx({
				'bg-white': true,
				'dark:bg-gray-900': true,
				'text-black': true,
				'dark:text-white': true
			})}>
			Dark mode
		</div>
	);
}

/**
 * ❌ Invalid: Object with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function ObjectWithInvalidVariant() {
	return (
		<div className={clsx({ flex: true, 'invalid-variant:bg-blue': isActive })}>Invalid variant</div>
	);
}

/**
 * ❌ Invalid: Object with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], w-[100px]]
 */
export function ObjectWithArbitraryAndInvalid() {
	return (
		<div className={clsx({ 'h-[50vh]': true, 'invalid-size': true, 'w-[100px]': isActive })}>
			Arbitrary and invalid
		</div>
	);
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Object in cn() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectInCnFunction() {
	return (
		<div className={cn({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Object in cn()
		</div>
	);
}

/**
 * ❌ Invalid: Object in cn() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectInCnFunctionInvalid() {
	return (
		<div className={cn({ flex: true, 'invalid-class': true, 'items-center': isActive })}>
			Invalid in cn()
		</div>
	);
}

/**
 * ✅ Valid: Object in classNames() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectInClassNamesFunction() {
	return (
		<div className={classNames({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Object in classNames()
		</div>
	);
}

// ========================================
// MULTIPLE OBJECTS AS ARGUMENTS
// ========================================

/**
 * ✅ Valid: Multiple objects, all valid
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function MultipleObjectsAllValid() {
	return <div className={clsx({ flex: true, 'items-center': true }, { 'justify-center': isActive, 'bg-blue-500': true })}>Multiple objects</div>;
}

/**
 * ❌ Invalid: Multiple objects with invalid in second object
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleObjectsInvalidInSecond() {
	return <div className={clsx({ flex: true, 'items-center': true }, { 'justify-center': isActive, 'invalid-class': true })}>Invalid in second</div>;
}

/**
 * ❌ Invalid: Multiple objects with invalid in first object
 * @invalidClasses [invalid-error]
 * @validClasses [items-center, justify-center, bg-blue-500]
 */
export function MultipleObjectsInvalidInFirst() {
	return <div className={clsx({ 'invalid-error': hasError, 'items-center': true }, { 'justify-center': isActive, 'bg-blue-500': true })}>Invalid in first</div>;
}

/**
 * ❌ Invalid: Multiple objects with invalid in both
 * @invalidClasses [invalid-first, invalid-second]
 * @validClasses [flex, bg-blue-500]
 */
export function MultipleObjectsInvalidInBoth() {
	return <div className={clsx({ flex: true, 'invalid-first': true }, { 'invalid-second': isActive, 'bg-blue-500': true })}>Invalid in both</div>;
}

/**
 * ✅ Valid: Three objects, all valid
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
export function ThreeObjectsAllValid() {
	return <div className={clsx({ flex: true }, { 'items-center': true, 'justify-center': isActive }, { 'bg-blue-500': true, 'text-white': true, 'font-bold': hasError })}>Three objects</div>;
}

// ========================================
// MIXED WITH OTHER PATTERNS
// ========================================

/**
 * ✅ Valid: Mix of object and static strings
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectMixedWithStatic() {
	return (
		<div
			className={clsx('flex', { 'items-center': true, 'justify-center': isActive }, 'bg-blue-500')}>
			Mixed with static
		</div>
	);
}

/**
 * ❌ Invalid: Mix with invalid in both object and static
 * @invalidClasses [invalid-static, invalid-object]
 * @validClasses [flex, items-center]
 */
export function ObjectMixedWithStaticInvalid() {
	return (
		<div
			className={clsx('flex', 'invalid-static', {
				'items-center': true,
				'invalid-object': isActive
			})}>
			Mixed invalid
		</div>
	);
}

/**
 * ✅ Valid: Mix of object and array
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectMixedWithArray() {
	return (
		<div
			className={clsx(['flex', 'items-center'], {
				'justify-center': true,
				'bg-blue-500': isActive
			})}>
			Mixed with array
		</div>
	);
}

// ========================================
// NESTED FUNCTION CALLS WITH OBJECTS
// ========================================

/**
 * ✅ Valid: Nested functions with objects
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectNestedFunctions() {
	return (
		<div
			className={clsx(
				'flex',
				cn({ 'items-center': true, 'justify-center': isActive }),
				'bg-blue-500'
			)}>
			Nested with object
		</div>
	);
}

/**
 * ❌ Invalid: Nested functions with invalid in object
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ObjectNestedFunctionsInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				cn({ 'items-center': true, 'invalid-class': isActive }),
				'bg-blue-500'
			)}>
			Nested invalid
		</div>
	);
}

// ========================================
// MULTIPLE JSX ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in object
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, items-center, justify-center]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, items-center]
 */
export function ObjectMultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx({ flex: true, 'invalid-error': hasError })}>Invalid in first</div>
			<div className={clsx({ flex: true, 'items-center': true, 'justify-center': isActive })}>
				Valid in second
			</div>
			<div className={clsx({ flex: true, 'items-center': true, 'invalid-class': isActive })}>
				Invalid in third
			</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing with object
 * @validClasses [w-full, h-auto, rounded-lg]
 */
export function ObjectSelfClosingValid() {
	return (
		<img
			className={clsx({ 'w-full': true, 'h-auto': true, 'rounded-lg': isActive })}
			src="test.jpg"
			alt="test"
		/>
	);
}

/**
 * ❌ Invalid: Self-closing with invalid in object
 * @invalidClasses [invalid-class]
 * @validClasses [w-full, h-auto]
 */
export function ObjectSelfClosingInvalid() {
	return (
		<img
			className={clsx({ 'w-full': true, 'invalid-class': true, 'h-auto': isActive })}
			src="test.jpg"
			alt="test"
		/>
	);
}

// ========================================
// MEMBER EXPRESSIONS WITH OBJECTS
// ========================================

/**
 * ✅ Valid: Member expression with object
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectMemberExpression() {
	return (
		<div className={utils.clsx({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Member with object
		</div>
	);
}

/**
 * ❌ Invalid: Member expression with invalid in object
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectMemberExpressionInvalid() {
	return (
		<div className={utils.clsx({ flex: true, 'invalid-class': true, 'items-center': isActive })}>
			Member invalid
		</div>
	);
}

// ========================================
// UNKNOWN FUNCTIONS (should be ignored)
// ========================================

/**
 * ✅ Valid: Unknown function with object (ignored, not validated)
 */
export function ObjectUnknownFunction() {
	return (
		<div
			className={unknownBuilder({ flex: true, 'totally-invalid': true, 'items-center': isActive })}>
			Unknown ignored
		</div>
	);
}

// ========================================
// CUSTOM UTILITY FUNCTIONS
// ========================================

/**
 * ✅ Valid: Custom utility function with object
 * @utilityFunctions [myCustomBuilder]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectCustomUtility() {
	return (
		<div
			className={myCustomBuilder({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Custom with object
		</div>
	);
}

// ========================================
// COMPUTED PROPERTY NAMES
// ========================================

/**
 * ✅ Valid: Computed property name with string literal
 * @validClasses [flex, items-center]
 */
export function ObjectComputedPropertyValid() {
	return (
		<div className={clsx({ ['flex']: true, ['items-center']: isActive })}>Computed property</div>
	);
}

/**
 * ❌ Invalid: Computed property name with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ObjectComputedPropertyInvalid() {
	return (
		<div className={clsx({ ['flex']: true, ['invalid-class']: isActive })}>Computed invalid</div>
	);
}

// ========================================
// TRAILING COMMAS
// ========================================

/**
 * ✅ Valid: Object with trailing comma
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectTrailingComma() {
	return (
		<div className={clsx({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Trailing comma
		</div>
	);
}

// Mock function declarations
declare function clsx(
	...args: (string | string[] | Record<string, boolean | any> | boolean | null | undefined)[]
): string;
declare function cn(
	...args: (string | string[] | Record<string, boolean | any> | boolean | null | undefined)[]
): string;
declare function classNames(
	...args: (string | string[] | Record<string, boolean | any> | boolean | null | undefined)[]
): string;
declare function unknownBuilder(...args: any[]): string;
declare function myCustomBuilder(...args: any[]): string;

declare const utils: {
	clsx(...args: any[]): string;
};
