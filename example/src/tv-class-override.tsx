/**
 * E2E Test: Tailwind Variants Class Property Override
 * Context: tv() function calls with class/className overrides
 * Pattern: button({ color: 'primary', class: '...' })
 *
 * Tests validation of the `class` and `className` properties when calling
 * functions created by tv(). This is a NEW FEATURE that validates override
 * classes at the call site.
 *
 * Key requirements:
 * 1. Validates `class` property in tv() function calls
 * 2. Validates `className` property in tv() function calls
 * 3. Does NOT validate utility functions (myCustomBuilder, buildStyles)
 * 4. Only validates functions created by tv()
 * 5. Supports lite version: import { tv } from 'tailwind-variants/lite'
 */
import { tv } from 'tailwind-variants';
import { tv as tvLite } from 'tailwind-variants/lite';

// Setup: Define a tv() button (this definition is validated separately in tv-static.tsx)
const button = tv({
	base: 'font-semibold text-white py-1 px-3 rounded-full active:opacity-80',
	variants: {
		color: {
			primary: 'bg-blue-500 hover:bg-blue-700',
			secondary: 'bg-purple-500 hover:bg-purple-700',
			success: 'bg-green-500 hover:bg-green-700'
		}
	}
});

// Setup: Define utility functions (should be excluded from validation)
function myCustomBuilder(config: { class?: string }) {
	return config.class || '';
}

function buildStyles(config: { className?: string }) {
	return config.className || '';
}

// ========================================
// CLASS PROPERTY OVERRIDE TESTS
// ========================================

/**
 * ✅ Valid: class property with valid Tailwind classes
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function ClassOverrideValid() {
	return (
		<button className={button({ color: 'secondary', class: 'bg-pink-500 hover:bg-pink-700' })}>
			Valid Override
		</button>
	);
}

/**
 * ❌ Invalid: class property with invalid Tailwind classes
 * @invalidClasses [invalid-override-class]
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function ClassOverrideInvalid() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'bg-pink-500 invalid-override-class hover:bg-pink-700'
			})}>
			Invalid Override
		</button>
	);
}

// ========================================
// CLASSNAME PROPERTY OVERRIDE TESTS
// ========================================

/**
 * ✅ Valid: className property with valid Tailwind classes
 * @validClasses [bg-teal-500, hover:bg-teal-700]
 */
export function ClassNameOverrideValid() {
	return (
		<button className={button({ color: 'success', className: 'bg-teal-500 hover:bg-teal-700' })}>
			Valid className Override
		</button>
	);
}

/**
 * ❌ Invalid: className property with invalid Tailwind classes
 * @invalidClasses [invalid-classname-override]
 * @validClasses [bg-teal-500]
 */
export function ClassNameOverrideInvalid() {
	return (
		<button
			className={button({
				color: 'primary',
				className: 'bg-teal-500 invalid-classname-override'
			})}>
			Invalid className Override
		</button>
	);
}

// ========================================
// MULTIPLE INVALID CLASSES
// ========================================

/**
 * ❌ Invalid: Multiple invalid classes should all be detected
 * @invalidClasses [invalid-class-1, invalid-class-2]
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function MultipleInvalidClasses() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'invalid-class-1 bg-pink-500 invalid-class-2 hover:bg-pink-700'
			})}>
			Multiple Invalid Classes
		</button>
	);
}

// ========================================
// UTILITY FUNCTION EXCLUSION TESTS
// ========================================

/**
 * ✅ Valid: Utility function with "invalid" classes should NOT be validated
 * @validClasses []
 */
export function UtilityFunctionNotValidated1() {
	return (
		<div className={myCustomBuilder({ class: 'this-is-not-validated invalid-but-ok' })}>
			Utility Function 1 (should not validate)
		</div>
	);
}

/**
 * ✅ Valid: Another utility function should NOT be validated
 * @validClasses []
 */
export function UtilityFunctionNotValidated2() {
	return (
		<div className={buildStyles({ className: 'also-not-validated another-invalid' })}>
			Utility Function 2 (should not validate)
		</div>
	);
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Empty class property should not error
 * @validClasses []
 */
export function EmptyClassOverride() {
	return <button className={button({ color: 'primary', class: '' })}>Empty Override</button>;
}

/**
 * ✅ Valid: No class override, only variant
 * @validClasses []
 */
export function NoClassOverride() {
	return <button className={button({ color: 'primary' })}>No Override</button>;
}

/**
 * ❌ Invalid: class with only invalid classes (no valid ones)
 * @invalidClasses [completely-invalid, another-invalid-class]
 */
export function AllInvalidClasses() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'completely-invalid another-invalid-class'
			})}>
			All Invalid
		</button>
	);
}

// ========================================
// COMPLEX MODIFIERS
// ========================================

/**
 * ✅ Valid: Complex valid classes with modifiers
 * @validClasses [md:bg-purple-600, lg:hover:bg-purple-800, dark:bg-purple-900]
 */
export function ComplexValidModifiers() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'md:bg-purple-600 lg:hover:bg-purple-800 dark:bg-purple-900'
			})}>
			Complex Valid Modifiers
		</button>
	);
}

/**
 * ❌ Invalid: Complex classes with invalid modifier combinations
 * @invalidClasses [invalid-modifier:bg-red-500]
 * @validClasses [md:bg-purple-600]
 */
export function ComplexInvalidModifier() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'md:bg-purple-600 invalid-modifier:bg-red-500'
			})}>
			Invalid Modifier
		</button>
	);
}

// ========================================
// LITE VERSION CLASS OVERRIDE TESTS
// ========================================

// Setup: Define a tv() button using lite version
const buttonLite = tvLite({
	base: 'font-bold text-white py-2 px-4 rounded-lg',
	variants: {
		color: {
			primary: 'bg-indigo-500 hover:bg-indigo-700',
			secondary: 'bg-gray-500 hover:bg-gray-700'
		}
	}
});

/**
 * ✅ Valid: Lite version with valid class override
 * @validClasses [bg-cyan-500, hover:bg-cyan-700]
 */
export function LiteClassOverrideValid() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'bg-cyan-500 hover:bg-cyan-700'
			})}>
			Valid Lite Override
		</button>
	);
}

/**
 * ❌ Invalid: Lite version with invalid class override
 * @invalidClasses [invalid-lite-override]
 * @validClasses [bg-cyan-500]
 */
export function LiteClassOverrideInvalid() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'bg-cyan-500 invalid-lite-override'
			})}>
			Invalid Lite Override
		</button>
	);
}

/**
 * ✅ Valid: Lite version with valid className override
 * @validClasses [bg-orange-500, hover:bg-orange-700, font-extrabold]
 */
export function LiteClassNameOverrideValid() {
	return (
		<button
			className={buttonLite({
				color: 'secondary',
				className: 'bg-orange-500 hover:bg-orange-700 font-extrabold'
			})}>
			Valid Lite className Override
		</button>
	);
}

/**
 * ❌ Invalid: Lite version with invalid className override
 * @invalidClasses [invalid-lite-classname]
 * @validClasses [bg-orange-500]
 */
export function LiteClassNameOverrideInvalid() {
	return (
		<button
			className={buttonLite({
				color: 'secondary',
				className: 'bg-orange-500 invalid-lite-classname'
			})}>
			Invalid Lite className Override
		</button>
	);
}

/**
 * ❌ Invalid: Lite version with multiple invalid classes
 * @invalidClasses [invalid-lite-1, invalid-lite-2]
 * @validClasses [bg-red-600, text-white]
 */
export function LiteMultipleInvalidClasses() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'invalid-lite-1 bg-red-600 invalid-lite-2 text-white'
			})}>
			Multiple Invalid in Lite
		</button>
	);
}

/**
 * ✅ Valid: Lite version with complex modifiers
 * @validClasses [sm:bg-teal-500, md:bg-teal-600, lg:hover:bg-teal-700]
 */
export function LiteComplexModifiersValid() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'sm:bg-teal-500 md:bg-teal-600 lg:hover:bg-teal-700'
			})}>
			Valid Lite Complex Modifiers
		</button>
	);
}
