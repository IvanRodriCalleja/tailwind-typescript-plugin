/**
 * E2E Test: Class Variance Authority cva() Definitions
 * Context: cva() function configuration validation
 * Pattern: cva(['base'], { variants: {...}, compoundVariants: [...] })
 *
 * Tests validation of class names within cva() function definitions.
 * The plugin validates all Tailwind classes used in:
 * - base: array of strings or single string (first argument)
 * - variants: nested object with string/array values
 * - compoundVariants: array with class/className properties
 * - Boolean variants: { disabled: { true: [...], false: null } }
 *
 * Also supports:
 * - Import aliasing: import { cva as myCva } from 'class-variance-authority'
 * - Array or string syntax: ['flex', 'items-center'] OR 'flex items-center'
 */
import { cva } from 'class-variance-authority';
import { cva as myCva } from 'class-variance-authority';

// ========================================
// BASE CLASSES TESTS (First Argument)
// ========================================

/**
 * ✅ Valid: Array of valid base classes
 * @validClasses [font-semibold, border, rounded]
 */
export function CvaBaseArrayValid() {
	const button = cva(['font-semibold', 'border', 'rounded']);
	return <button className={button()}>Valid Base Array</button>;
}

/**
 * ❌ Invalid: Array with invalid class
 * @invalidClasses [invalid-base-class]
 * @validClasses [font-semibold, border]
 */
export function CvaBaseArrayInvalid() {
	const button = cva(['font-semibold', 'invalid-base-class', 'border']);
	return <button className={button()}>Invalid Base Array</button>;
}

/**
 * ✅ Valid: String of valid base classes
 * @validClasses [font-semibold, border, rounded]
 */
export function CvaBaseStringValid() {
	const button = cva('font-semibold border rounded');
	return <button className={button()}>Valid Base String</button>;
}

/**
 * ❌ Invalid: String with invalid class
 * @invalidClasses [invalid-base-string]
 * @validClasses [font-semibold, border]
 */
export function CvaBaseStringInvalid() {
	const button = cva('font-semibold invalid-base-string border');
	return <button className={button()}>Invalid Base String</button>;
}

// ========================================
// VARIANTS TESTS
// ========================================

/**
 * ✅ Valid: All variant classes are valid (arrays)
 * @validClasses [bg-blue-500, text-white, border-transparent, bg-white, text-gray-800]
 */
export function CvaVariantsArrayValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: ['bg-blue-500', 'text-white', 'border-transparent'],
				secondary: ['bg-white', 'text-gray-800']
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Valid Variants</button>;
}

/**
 * ❌ Invalid: Variant with invalid class in array
 * @invalidClasses [invalid-variant-class]
 * @validClasses [bg-blue-500, text-white]
 */
export function CvaVariantsArrayInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: ['bg-blue-500', 'invalid-variant-class', 'text-white']
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Invalid Variant</button>;
}

/**
 * ✅ Valid: Variants as strings
 * @validClasses [bg-blue-500, text-white, border-transparent, hover:bg-blue-600]
 */
export function CvaVariantsStringValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 text-white border-transparent hover:bg-blue-600'
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Valid String Variant</button>;
}

/**
 * ❌ Invalid: Variant string with invalid class
 * @invalidClasses [invalid-string-variant]
 * @validClasses [bg-blue-500, text-white]
 */
export function CvaVariantsStringInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 invalid-string-variant text-white'
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Invalid String Variant</button>;
}

// ========================================
// BOOLEAN VARIANTS TESTS
// ========================================

/**
 * ✅ Valid: Boolean variants with null for false
 * @validClasses [opacity-50, cursor-not-allowed]
 */
export function CvaBooleanVariantValid() {
	const button = cva(['font-semibold'], {
		variants: {
			disabled: {
				false: null,
				true: ['opacity-50', 'cursor-not-allowed']
			}
		}
	});
	return <button className={button({ disabled: true })}>Valid Boolean Variant</button>;
}

/**
 * ❌ Invalid: Boolean variant with invalid class
 * @invalidClasses [invalid-disabled-class]
 * @validClasses [opacity-50]
 */
export function CvaBooleanVariantInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			disabled: {
				false: null,
				true: ['opacity-50', 'invalid-disabled-class']
			}
		}
	});
	return <button className={button({ disabled: true })}>Invalid Boolean Variant</button>;
}

// ========================================
// COMPOUND VARIANTS TESTS
// ========================================

/**
 * ✅ Valid: Compound variants with valid classes
 * @validClasses [hover:bg-blue-600, uppercase]
 */
export function CvaCompoundVariantsValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: { primary: 'bg-blue-500', secondary: 'bg-white' },
			size: { small: 'text-sm', medium: 'text-base' }
		},
		compoundVariants: [
			{
				intent: 'primary',
				size: 'medium',
				class: 'hover:bg-blue-600 uppercase'
			}
		]
	});
	return <button className={button({ intent: 'primary', size: 'medium' })}>Valid Compound</button>;
}

/**
 * ❌ Invalid: Compound variant with invalid class
 * @invalidClasses [invalid-compound-class]
 * @validClasses [hover:bg-blue-600]
 */
export function CvaCompoundVariantsInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: { primary: 'bg-blue-500' }
		},
		compoundVariants: [
			{
				intent: 'primary',
				class: 'hover:bg-blue-600 invalid-compound-class'
			}
		]
	});
	return <button className={button({ intent: 'primary' })}>Invalid Compound</button>;
}

/**
 * ✅ Valid: Compound variant using className property
 * @validClasses [hover:bg-gray-100, font-bold]
 */
export function CvaCompoundVariantsClassNameValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: { secondary: 'bg-white' }
		},
		compoundVariants: [
			{
				intent: 'secondary',
				className: 'hover:bg-gray-100 font-bold'
			}
		]
	});
	return <button className={button({ intent: 'secondary' })}>Valid className</button>;
}

// ========================================
// IMPORT ALIASING TESTS
// ========================================

/**
 * ✅ Valid: Import aliasing - using myCva instead of cva
 * @validClasses [flex, items-center, gap-2, bg-blue-500]
 */
export function CvaAliasedValid() {
	const component = myCva(['flex', 'items-center', 'gap-2'], {
		variants: {
			variant: { primary: 'bg-blue-500' }
		}
	});
	return <div className={component({ variant: 'primary' })}>Valid Aliased</div>;
}

/**
 * ❌ Invalid: Import aliasing with invalid class
 * @invalidClasses [invalid-aliased-class]
 * @validClasses [flex, items-center]
 */
export function CvaAliasedInvalid() {
	const component = myCva(['flex', 'invalid-aliased-class', 'items-center']);
	return <div className={component()}>Invalid Aliased</div>;
}

// ========================================
// COMPLEX TESTS
// ========================================

/**
 * ✅ Valid: Mix of arrays and strings
 * @validClasses [font-semibold, border, bg-blue-500, text-white, text-sm, py-1]
 */
export function CvaMixedValid() {
	const button = cva(['font-semibold', 'border'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 text-white'
			},
			size: {
				small: ['text-sm', 'py-1']
			}
		}
	});
	return <button className={button({ intent: 'primary', size: 'small' })}>Mixed Valid</button>;
}

/**
 * ❌ Invalid: Multiple invalid classes across different sections
 * @invalidClasses [invalid-base, invalid-variant, invalid-compound]
 * @validClasses [font-semibold, bg-blue-500]
 */
export function CvaMixedInvalid() {
	const button = cva(['font-semibold', 'invalid-base'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 invalid-variant'
			}
		},
		compoundVariants: [
			{
				intent: 'primary',
				class: 'invalid-compound'
			}
		]
	});
	return <button className={button({ intent: 'primary' })}>Mixed Invalid</button>;
}
