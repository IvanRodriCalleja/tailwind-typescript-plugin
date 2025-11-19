/**
 * E2E Test: Function Static
 * Context: function (function call)
 * Pattern: static (string literal arguments)
 *
 * Tests validation of: className={clsx('...', '...')}
 */

// ========================================
// SINGLE ARGUMENT TESTS
// ========================================

/**
 * ✅ Valid: Single argument with valid class
 * @validClasses [flex]
 */
export function SingleArgumentValid() {
	return <div className={clsx('flex')}>Single valid argument</div>;
}

/**
 * ❌ Invalid: Single argument with invalid class
 * @invalidClasses [invalid-class]
 */
export function SingleArgumentInvalid() {
	return <div className={clsx('invalid-class')}>Single invalid argument</div>;
}

/**
 * ✅ Valid: Single argument with multiple valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function SingleArgumentMultipleClasses() {
	return (
		<div className={clsx('flex items-center justify-center')}>Multiple classes in one arg</div>
	);
}

/**
 * ❌ Invalid: Single argument with mix of valid and invalid classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function SingleArgumentMixedClasses() {
	return (
		<div className={clsx('flex invalid-class items-center')}>
			Mixed valid and invalid in one arg
		</div>
	);
}

// ========================================
// MULTIPLE ARGUMENTS TESTS
// ========================================

/**
 * ✅ Valid: Multiple arguments with valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleArgumentsAllValid() {
	return (
		<div className={clsx('flex', 'items-center', 'justify-center')}>Multiple valid arguments</div>
	);
}

/**
 * ❌ Invalid: Multiple arguments, all invalid
 * @invalidClasses [invalid-one, invalid-two, invalid-three]
 */
export function MultipleArgumentsAllInvalid() {
	return (
		<div className={clsx('invalid-one', 'invalid-two', 'invalid-three')}>
			Multiple invalid arguments
		</div>
	);
}

/**
 * ❌ Invalid: Multiple arguments with mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MultipleArgumentsMixed() {
	return <div className={clsx('flex', 'invalid-class', 'items-center')}>Mixed arguments</div>;
}

/**
 * ❌ Invalid: Invalid class in first argument
 * @invalidClasses [invalid-first]
 * @validClasses [items-center, justify-center]
 */
export function InvalidInFirstArgument() {
	return (
		<div className={clsx('invalid-first', 'items-center', 'justify-center')}>Invalid in first</div>
	);
}

/**
 * ❌ Invalid: Invalid class in last argument
 * @invalidClasses [invalid-last]
 * @validClasses [flex, items-center]
 */
export function InvalidInLastArgument() {
	return <div className={clsx('flex', 'items-center', 'invalid-last')}>Invalid in last</div>;
}

/**
 * ❌ Invalid: Invalid class in middle argument
 * @invalidClasses [invalid-middle]
 * @validClasses [flex, justify-center]
 */
export function InvalidInMiddleArgument() {
	return <div className={clsx('flex', 'invalid-middle', 'justify-center')}>Invalid in middle</div>;
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Empty string argument
 * @validClasses [flex, items-center]
 */
export function EmptyStringArgument() {
	return <div className={clsx('flex', '', 'items-center')}>Empty string argument</div>;
}

/**
 * ✅ Valid: Function call with no arguments
 */
export function NoArguments() {
	return <div className={clsx()}>No arguments</div>;
}

/**
 * ✅ Valid: Multiple spaces in argument
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleSpacesInArgument() {
	return <div className={clsx('flex  items-center   justify-center')}>Multiple spaces</div>;
}

// ========================================
// TAILWIND FEATURES
// ========================================

/**
 * ✅ Valid: Function with arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function FunctionWithArbitraryValues() {
	return (
		<div className={clsx('h-[50vh]', 'w-[100px]', 'bg-[#ff0000]')}>
			Function with arbitrary values
		</div>
	);
}

/**
 * ✅ Valid: Function with variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function FunctionWithVariants() {
	return (
		<div className={clsx('hover:bg-blue-500', 'focus:ring-2', 'active:scale-95')}>
			Function with variants
		</div>
	);
}

/**
 * ✅ Valid: Function with responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3]
 */
export function FunctionWithResponsiveVariants() {
	return (
		<div className={clsx('sm:flex', 'md:grid', 'lg:grid-cols-3')}>
			Function with responsive variants
		</div>
	);
}

/**
 * ✅ Valid: Function with dark mode variants
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function FunctionWithDarkMode() {
	return (
		<div className={clsx('bg-white dark:bg-gray-900', 'text-black dark:text-white')}>
			Function with dark mode
		</div>
	);
}

/**
 * ❌ Invalid: Function with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function FunctionWithInvalidVariant() {
	return (
		<div className={clsx('flex', 'invalid-variant:bg-blue')}>Function with invalid variant</div>
	);
}

/**
 * ❌ Invalid: Function with mix of arbitrary and invalid classes
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], w-[100px]]
 */
export function FunctionWithArbitraryAndInvalid() {
	return (
		<div className={clsx('h-[50vh]', 'invalid-size', 'w-[100px]')}>
			Function with arbitrary and invalid
		</div>
	);
}

// ========================================
// DIFFERENT FUNCTION NAMES
// ========================================

/**
 * ✅ Valid: Using cn() function
 * @validClasses [flex, items-center, justify-center]
 */
export function UsingCnFunction() {
	return <div className={cn('flex', 'items-center', 'justify-center')}>Using cn function</div>;
}

/**
 * ❌ Invalid: Using cn() function with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function UsingCnFunctionInvalid() {
	return <div className={cn('flex', 'invalid-class', 'items-center')}>Using cn with invalid</div>;
}

/**
 * ✅ Valid: Using classNames() function
 * @validClasses [flex, items-center, justify-center]
 */
export function UsingClassNamesFunction() {
	return (
		<div className={classNames('flex', 'items-center', 'justify-center')}>
			Using classNames function
		</div>
	);
}

/**
 * ❌ Invalid: Using classNames() function with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function UsingClassNamesFunctionInvalid() {
	return (
		<div className={classNames('flex', 'invalid-class', 'items-center')}>
			Using classNames with invalid
		</div>
	);
}

// ========================================
// NESTED FUNCTION CALLS
// ========================================

/**
 * ✅ Valid: Nested function calls
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedFunctionCalls() {
	return (
		<div className={clsx('flex', cn('items-center', 'justify-center'), 'bg-blue-500')}>
			Nested function calls
		</div>
	);
}

/**
 * ❌ Invalid: Nested function calls with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function NestedFunctionCallsInvalid() {
	return (
		<div className={clsx('flex', cn('items-center', 'invalid-class'), 'bg-blue-500')}>
			Nested with invalid
		</div>
	);
}

// ========================================
// MULTIPLE ELEMENTS
// ========================================

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid class
 * @invalidClasses {1} [invalid-error]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid classes
 * @validClasses {2} [flex, items-center, justify-center]
 * @element {3} Third child with invalid class
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, items-center]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={clsx('flex', 'invalid-error')}>Invalid in first child</div>
			<div className={clsx('flex', 'items-center', 'justify-center')}>Valid in second child</div>
			<div className={clsx('flex', 'items-center', 'invalid-class')}>Invalid in third child</div>
		</div>
	);
}

// ========================================
// SELF-CLOSING ELEMENTS
// ========================================

/**
 * ✅ Valid: Self-closing element with valid classes
 * @validClasses [w-full, h-auto, rounded-lg]
 */
export function SelfClosingValid() {
	return <img className={clsx('w-full', 'h-auto', 'rounded-lg')} src="test.jpg" alt="test" />;
}

/**
 * ❌ Invalid: Self-closing element with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingInvalid() {
	return <img className={clsx('w-full', 'invalid-class', 'h-auto')} src="test.jpg" alt="test" />;
}

// ========================================
// MEMBER EXPRESSIONS (utils.cn, lib.clsx)
// ========================================

/**
 * ✅ Valid: Member expression with valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MemberExpressionValid() {
	return (
		<div className={utils.cn('flex', 'items-center', 'justify-center')}>
			Member expression valid
		</div>
	);
}

/**
 * ❌ Invalid: Member expression with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MemberExpressionInvalid() {
	return (
		<div className={utils.cn('flex', 'invalid-class', 'items-center')}>
			Member expression with invalid
		</div>
	);
}

/**
 * ✅ Valid: Deep member expression
 * @validClasses [flex, items-center]
 */
export function DeepMemberExpression() {
	return <div className={lib.utils.cn('flex', 'items-center')}>Deep member expression</div>;
}

// ========================================
// DYNAMIC CALLS (should not throw errors)
// ========================================

/**
 * ✅ Valid: Dynamic function call (should be ignored, not validated)
 */
export function DynamicCallIgnored() {
	const functions = { cn: cn };
	return <div className={functions['cn']('flex', 'items-center')}>Dynamic call</div>;
}

/**
 * ✅ Valid: Computed property (should be ignored, not validated)
 */
export function ComputedPropertyIgnored() {
	const key = 'cn';
	const functions = { cn: cn };
	return <div className={functions[key]('flex', 'items-center')}>Computed property</div>;
}

// ========================================
// UNKNOWN FUNCTIONS (not in utilityFunctions list)
// ========================================

/**
 * ✅ Valid: Unknown function is ignored (not validated)
 * This function is NOT in the default list, so it won't be validated.
 * Even if we pass invalid classes, they won't be caught.
 */
export function UnknownFunctionIgnored() {
	return (
		<div className={unknownFunction('flex', 'totally-invalid-class', 'items-center')}>
			Unknown function - not validated
		</div>
	);
}

/**
 * ✅ Valid: Another unknown function with invalid classes (ignored)
 * randomBuilder is not in the default list, so validation is skipped
 */
export function RandomFunctionNotValidated() {
	return (
		<div className={randomBuilder('this-is-invalid', 'also-invalid', 'completely-wrong')}>
			Random function - ignored by plugin
		</div>
	);
}

// ========================================
// CUSTOM UTILITY FUNCTIONS
// Note: To test these, add to tsconfig.json:
// "utilityFunctions": ["myCustomBuilder", "buildStyles"]
// ========================================

/**
 * ✅ Valid: Custom utility function with valid classes
 * @utilityFunctions [myCustomBuilder]
 * @validClasses [flex, items-center, justify-center]
 */
export function CustomUtilityFunctionValid() {
	return (
		<div className={myCustomBuilder('flex', 'items-center', 'justify-center')}>
			Custom utility function
		</div>
	);
}

/**
 * ✅ Valid: Custom utility function (example - requires config)
 * @utilityFunctions [myCustomBuilder]
 * Note: This demonstrates the @utilityFunctions annotation.
 * To actually validate this, add "utilityFunctions": ["myCustomBuilder"] to your tsconfig.json
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function CustomUtilityFunctionExample() {
	return (
		<div className={myCustomBuilder('flex', 'items-center', 'bg-blue-500')}>
			Custom utility example
		</div>
	);
}

/**
 * ✅ Valid: Another custom function
 * @utilityFunctions [buildStyles]
 * @validClasses [flex, items-center]
 */
export function AnotherCustomFunction() {
	return <div className={buildStyles('flex', 'items-center')}>Another custom function</div>;
}

// Mock function declarations and objects (these would normally come from libraries)
declare function clsx(...args: string[]): string;
declare function cn(...args: string[]): string;
declare function classNames(...args: string[]): string;
declare function myCustomBuilder(...args: string[]): string;
declare function buildStyles(...args: string[]): string;
declare function unknownFunction(...args: string[]): string;
declare function randomBuilder(...args: string[]): string;

declare const utils: {
	cn(...args: string[]): string;
};

declare const lib: {
	utils: {
		cn(...args: string[]): string;
	};
};
