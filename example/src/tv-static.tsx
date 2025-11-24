/**
 * E2E Test: Tailwind Variants tv() Definitions
 * Context: tv() function configuration validation
 * Pattern: tv({ base: '...', variants: {...}, compoundVariants: [...], slots: {...} })
 *
 * Tests validation of class names within tv() function definitions.
 * The plugin validates all Tailwind classes used in:
 * - base property (string or array)
 * - variants object (nested structure with strings or arrays)
 * - compoundVariants array
 * - slots object
 *
 * Also supports:
 * - Import aliasing: import { tv as myTv } from 'tailwind-variants'
 * - Lite version: import { tv } from 'tailwind-variants/lite'
 * - Array syntax: base: ['font-semibold', 'text-white']
 */
import { tv } from 'tailwind-variants';
import { tv as myTv } from 'tailwind-variants';
import { tv as tvLite } from 'tailwind-variants/lite';

// ========================================
// BASE PROPERTY TESTS
// ========================================

/**
 * ✅ Valid: All classes exist in base
 * @validClasses [font-semibold, text-white, text-sm, py-1, px-4, rounded-full, active:opacity-80]
 */
export function TvBaseValid() {
	const button = tv({
		base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80'
	});
	return <button className={button()}>Valid Base</button>;
}

/**
 * ❌ Invalid: Contains invalid class in base
 * @invalidClasses [invalid-base-class]
 * @validClasses [font-semibold, text-white]
 */
export function TvBaseInvalid() {
	const button = tv({
		base: 'font-semibold invalid-base-class text-white'
	});
	return <button className={button()}>Invalid Base</button>;
}

// ========================================
// VARIANTS TESTS
// ========================================

/**
 * ✅ Valid: All variant classes are valid
 * @validClasses [bg-blue-500, hover:bg-blue-700, bg-purple-500, hover:bg-purple-700, bg-green-500]
 */
export function TvVariantsValid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: 'bg-blue-500 hover:bg-blue-700',
				secondary: 'bg-purple-500 hover:bg-purple-700',
				success: 'bg-green-500'
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Valid Variants</button>;
}

/**
 * ❌ Invalid: Contains invalid class in variant
 * @invalidClasses [invalid-variant-class]
 * @validClasses [bg-blue-500]
 */
export function TvVariantsInvalid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: 'bg-blue-500 invalid-variant-class'
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Variant</button>;
}

// ========================================
// COMPOUND VARIANTS TESTS
// ========================================

/**
 * ✅ Valid: Compound variants with valid classes
 * @validClasses [font-bold, text-xl]
 */
export function TvCompoundVariantsValid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: 'font-bold text-xl' }]
	});
	return <button className={button({ color: 'primary', size: 'lg' })}>Valid Compound</button>;
}

/**
 * ❌ Invalid: Compound variants with invalid class
 * @invalidClasses [invalid-compound-class]
 * @validClasses [font-bold]
 */
export function TvCompoundVariantsInvalid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: 'invalid-compound-class font-bold' }]
	});
	return <button className={button({ color: 'primary' })}>Invalid Compound</button>;
}

// ========================================
// SLOTS TESTS
// ========================================

/**
 * ✅ Valid: Slots with valid classes
 * @validClasses [flex, items-center, mr-2, text-blue-500, font-semibold]
 */
export function TvSlotsValid() {
	const component = tv({
		slots: {
			base: 'flex items-center',
			icon: 'mr-2 text-blue-500',
			label: 'font-semibold'
		}
	});
	return (
		<div className={component().base}>
			<span className={component().icon}>Icon</span>
		</div>
	);
}

/**
 * ❌ Invalid: Slots with invalid class
 * @invalidClasses [invalid-slot-class]
 * @validClasses [mr-2]
 */
export function TvSlotsInvalid() {
	const component = tv({
		slots: {
			base: 'flex',
			icon: 'invalid-slot-class mr-2'
		}
	});
	return <span className={component().icon}>Invalid Slot</span>;
}

// ========================================
// ARRAY SYNTAX TESTS
// ========================================

/**
 * ✅ Valid: Array syntax for base property
 * @validClasses [font-semibold, text-white, px-4, py-2, rounded-full]
 */
export function TvArrayBaseValid() {
	const button = tv({
		base: ['font-semibold', 'text-white', 'px-4', 'py-2', 'rounded-full']
	});
	return <button className={button()}>Valid Array Base</button>;
}

/**
 * ❌ Invalid: Array with invalid class
 * @invalidClasses [invalid-array-class]
 * @validClasses [font-semibold, text-white]
 */
export function TvArrayBaseInvalid() {
	const button = tv({
		base: ['font-semibold', 'invalid-array-class', 'text-white']
	});
	return <button className={button()}>Invalid Array Base</button>;
}

/**
 * ✅ Valid: Array syntax in variants
 * @validClasses [bg-blue-500, hover:bg-blue-700, text-white, text-xs, px-2, py-1]
 */
export function TvArrayVariantsValid() {
	const button = tv({
		base: 'px-4',
		variants: {
			color: {
				primary: ['bg-blue-500', 'hover:bg-blue-700', 'text-white']
			},
			size: {
				sm: ['text-xs', 'px-2', 'py-1']
			}
		}
	});
	return <button className={button({ color: 'primary', size: 'sm' })}>Valid Array Variants</button>;
}

/**
 * ❌ Invalid: Array in variants with invalid class
 * @invalidClasses [invalid-in-array]
 * @validClasses [bg-blue-500, text-white]
 */
export function TvArrayVariantsInvalid() {
	const button = tv({
		base: 'px-4',
		variants: {
			color: {
				primary: ['bg-blue-500', 'invalid-in-array', 'text-white']
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Array Variants</button>;
}

// ========================================
// IMPORT ALIASING TESTS
// ========================================

/**
 * ✅ Valid: Import aliasing - using myTv instead of tv
 * @validClasses [flex, items-center, gap-2, bg-blue-500]
 */
export function TvAliasedValid() {
	const component = myTv({
		base: 'flex items-center gap-2',
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
export function TvAliasedInvalid() {
	const component = myTv({
		base: 'flex invalid-aliased-class items-center'
	});
	return <div className={component()}>Invalid Aliased</div>;
}

/**
 * ✅ Valid: Combining arrays and aliasing
 * @validClasses [flex, items-center, gap-2, text-sm, px-2, text-lg, px-6]
 */
export function TvArrayAliasedValid() {
	const component = myTv({
		base: ['flex', 'items-center', 'gap-2'],
		variants: {
			size: {
				sm: ['text-sm', 'px-2'],
				lg: ['text-lg', 'px-6']
			}
		}
	});
	return <div className={component({ size: 'lg' })}>Valid Array + Aliased</div>;
}

/**
 * ❌ Invalid: Array with aliasing and invalid class
 * @invalidClasses [invalid-combo-class]
 * @validClasses [flex, items-center]
 */
export function TvArrayAliasedInvalid() {
	const component = myTv({
		base: ['flex', 'items-center', 'invalid-combo-class']
	});
	return <div className={component()}>Invalid Array + Aliased</div>;
}

// ========================================
// LITE VERSION TESTS
// ========================================

/**
 * ✅ Valid: Lite version with valid base classes
 * @validClasses [font-bold, text-blue-600, px-4, py-2, rounded-lg]
 */
export function TvLiteBaseValid() {
	const button = tvLite({
		base: 'font-bold text-blue-600 px-4 py-2 rounded-lg'
	});
	return <button className={button()}>Valid Lite Base</button>;
}

/**
 * ❌ Invalid: Lite version with invalid base class
 * @invalidClasses [invalid-lite-class]
 * @validClasses [font-bold, text-blue-600]
 */
export function TvLiteBaseInvalid() {
	const button = tvLite({
		base: 'font-bold invalid-lite-class text-blue-600'
	});
	return <button className={button()}>Invalid Lite Base</button>;
}

/**
 * ✅ Valid: Lite version with valid variants
 * @validClasses [bg-red-500, hover:bg-red-700, bg-yellow-500, hover:bg-yellow-700]
 */
export function TvLiteVariantsValid() {
	const button = tvLite({
		base: 'px-4 py-2',
		variants: {
			color: {
				danger: 'bg-red-500 hover:bg-red-700',
				warning: 'bg-yellow-500 hover:bg-yellow-700'
			}
		}
	});
	return <button className={button({ color: 'danger' })}>Valid Lite Variants</button>;
}

/**
 * ❌ Invalid: Lite version with invalid variant class
 * @invalidClasses [invalid-lite-variant]
 * @validClasses [bg-red-500]
 */
export function TvLiteVariantsInvalid() {
	const button = tvLite({
		base: 'px-4',
		variants: {
			color: {
				danger: 'bg-red-500 invalid-lite-variant'
			}
		}
	});
	return <button className={button({ color: 'danger' })}>Invalid Lite Variants</button>;
}

/**
 * ✅ Valid: Lite version with array syntax
 * @validClasses [flex, items-center, gap-4, text-sm, font-medium]
 */
export function TvLiteArrayValid() {
	const component = tvLite({
		base: ['flex', 'items-center', 'gap-4'],
		variants: {
			size: {
				sm: ['text-sm', 'font-medium']
			}
		}
	});
	return <div className={component({ size: 'sm' })}>Valid Lite Array</div>;
}

/**
 * ❌ Invalid: Lite version with invalid class in array
 * @invalidClasses [invalid-lite-array]
 * @validClasses [flex, items-center]
 */
export function TvLiteArrayInvalid() {
	const component = tvLite({
		base: ['flex', 'invalid-lite-array', 'items-center']
	});
	return <div className={component()}>Invalid Lite Array</div>;
}
