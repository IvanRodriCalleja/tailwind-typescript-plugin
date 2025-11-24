/**
 * E2E Test: Class Variance Authority Class Property Override
 * Context: cva() function calls with class/className overrides
 * Pattern: button({ intent: 'primary', class: '...' })
 *
 * Tests validation of the `class` and `className` properties when calling
 * functions created by cva(). This validates override classes at the call site.
 *
 * Key requirements:
 * 1. Validates `class` property in cva() function calls
 * 2. Validates `className` property in cva() function calls
 * 3. Does NOT validate utility functions
 * 4. Only validates functions created by cva()
 */
import { cva } from 'class-variance-authority';

// Setup: Define a cva() button (this definition is validated separately in cva-static.tsx)
const button = cva(['font-semibold', 'border', 'rounded'], {
	variants: {
		intent: {
			primary: ['bg-blue-500', 'text-white', 'border-transparent'],
			secondary: ['bg-white', 'text-gray-800', 'border-gray-400']
		},
		size: {
			small: ['text-sm', 'py-1', 'px-2'],
			medium: ['text-base', 'py-2', 'px-4']
		}
	}
});

// ========================================
// CLASS PROPERTY OVERRIDE TESTS
// ========================================

/**
 * ✅ Valid: class property with valid Tailwind classes
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function CvaClassOverrideValid() {
	return (
		<button className={button({ intent: 'secondary', class: 'bg-pink-500 hover:bg-pink-700' })}>
			Valid Override
		</button>
	);
}

/**
 * ❌ Invalid: class property with invalid Tailwind classes
 * @invalidClasses [invalid-override-class]
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function CvaClassOverrideInvalid() {
	return (
		<button
			className={button({
				intent: 'primary',
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
export function CvaClassNameOverrideValid() {
	return (
		<button className={button({ intent: 'secondary', className: 'bg-teal-500 hover:bg-teal-700' })}>
			Valid className Override
		</button>
	);
}

/**
 * ❌ Invalid: className property with invalid Tailwind classes
 * @invalidClasses [invalid-classname-override]
 * @validClasses [bg-teal-500]
 */
export function CvaClassNameOverrideInvalid() {
	return (
		<button
			className={button({
				intent: 'primary',
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
export function CvaMultipleInvalidClasses() {
	return (
		<button
			className={button({
				intent: 'primary',
				class: 'invalid-class-1 bg-pink-500 invalid-class-2 hover:bg-pink-700'
			})}>
			Multiple Invalid Classes
		</button>
	);
}

// ========================================
// EDGE CASES
// ========================================

/**
 * ✅ Valid: Empty class property should not error
 * @validClasses []
 */
export function CvaEmptyClassOverride() {
	return <button className={button({ intent: 'primary', class: '' })}>Empty Override</button>;
}

/**
 * ✅ Valid: No class override, only variants
 * @validClasses []
 */
export function CvaNoClassOverride() {
	return <button className={button({ intent: 'primary' })}>No Override</button>;
}

/**
 * ❌ Invalid: class with only invalid classes (no valid ones)
 * @invalidClasses [completely-invalid, another-invalid-class]
 */
export function CvaAllInvalidClasses() {
	return (
		<button
			className={button({
				intent: 'primary',
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
export function CvaComplexValidModifiers() {
	return (
		<button
			className={button({
				intent: 'primary',
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
export function CvaComplexInvalidModifier() {
	return (
		<button
			className={button({
				intent: 'primary',
				class: 'md:bg-purple-600 invalid-modifier:bg-red-500'
			})}>
			Invalid Modifier
		</button>
	);
}

// ========================================
// WITH MULTIPLE VARIANTS
// ========================================

/**
 * ✅ Valid: Override with multiple variant properties
 * @validClasses [bg-indigo-500, hover:bg-indigo-700]
 */
export function CvaMultipleVariantsWithOverride() {
	return (
		<button
			className={button({
				intent: 'primary',
				size: 'medium',
				class: 'bg-indigo-500 hover:bg-indigo-700'
			})}>
			Multiple Variants + Override
		</button>
	);
}

/**
 * ❌ Invalid: Override with multiple variants and invalid class
 * @invalidClasses [invalid-multi-variant]
 * @validClasses [bg-indigo-500]
 */
export function CvaMultipleVariantsWithInvalidOverride() {
	return (
		<button
			className={button({
				intent: 'secondary',
				size: 'small',
				class: 'bg-indigo-500 invalid-multi-variant'
			})}>
			Invalid Multi-Variant Override
		</button>
	);
}
