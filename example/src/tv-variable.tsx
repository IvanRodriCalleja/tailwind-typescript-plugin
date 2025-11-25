/**
 * Test: Variables used inside tailwind-variants tv() definitions
 * Pattern: tv({ base: myVar, variants: { color: { primary: myVar } } })
 */
import { tv } from 'tailwind-variants';

// ========================================
// BASE PROPERTY WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Variable with valid classes in base
 * @validClasses [flex, items-center]
 */
export function TvBaseVariableValid() {
	const validBase = 'flex items-center';
	const button = tv({
		base: validBase
	});
	return <button className={button()}>Valid Base Variable</button>;
}

/**
 * ❌ Invalid: Variable with invalid class in base
 * @invalidClasses [invalid-tv-base-var]
 */
export function TvBaseVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const button = tv({
		base: invalidBase
	});
	return <button className={button()}>Invalid Base Variable</button>;
}

/**
 * ❌ Invalid: Variable with mixed valid/invalid classes in base
 * @invalidClasses [invalid-tv-mixed-var]
 * @validClasses [flex, items-center]
 */
export function TvBaseVariableMixed() {
	const mixedClasses = 'flex invalid-tv-mixed-var items-center';
	const button = tv({
		base: mixedClasses
	});
	return <button className={button()}>Mixed Base Variable</button>;
}

// ========================================
// VARIANTS WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Variable with valid classes in variant
 * @validClasses [bg-blue-500, hover:bg-blue-700]
 */
export function TvVariantVariableValid() {
	const validVariant = 'bg-blue-500 hover:bg-blue-700';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: validVariant
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Valid Variant Variable</button>;
}

/**
 * ❌ Invalid: Variable with invalid class in variant
 * @invalidClasses [invalid-tv-variant-var]
 */
export function TvVariantVariableInvalid() {
	const invalidVariant = 'invalid-tv-variant-var';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: invalidVariant
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Variant Variable</button>;
}

// ========================================
// ARRAY WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Array base with variable element
 * @validClasses [flex, items-center, gap-2]
 */
export function TvArrayWithVariableValid() {
	const validBase = 'flex items-center';
	const button = tv({
		base: [validBase, 'gap-2']
	});
	return <button className={button()}>Valid Array Variable</button>;
}

/**
 * ❌ Invalid: Array base with invalid variable element
 * @invalidClasses [invalid-tv-base-var]
 * @validClasses [gap-2]
 */
export function TvArrayWithVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const button = tv({
		base: [invalidBase, 'gap-2']
	});
	return <button className={button()}>Invalid Array Variable</button>;
}

/**
 * ❌ Invalid: Array variant with invalid variable element
 * @invalidClasses [invalid-tv-variant-var]
 * @validClasses [text-sm]
 */
export function TvArrayVariantWithVariableInvalid() {
	const invalidVariant = 'invalid-tv-variant-var';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: [invalidVariant, 'text-sm']
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Array Variant Variable</button>;
}

// ========================================
// COMPOUND VARIANTS WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Compound variant with variable class
 * @validClasses [flex, items-center]
 */
export function TvCompoundVariantVariableValid() {
	const validBase = 'flex items-center';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: validBase }]
	});
	return (
		<button className={button({ color: 'primary', size: 'lg' })}>Valid Compound Variable</button>
	);
}

/**
 * ❌ Invalid: Compound variant with invalid variable class
 * @invalidClasses [invalid-tv-base-var]
 */
export function TvCompoundVariantVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: invalidBase }]
	});
	return <button className={button({ color: 'primary' })}>Invalid Compound Variable</button>;
}

// ========================================
// SLOTS WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Slot with variable value
 * @validClasses [flex, items-center]
 */
export function TvSlotVariableValid() {
	const validBase = 'flex items-center';
	const component = tv({
		slots: {
			base: validBase
		}
	});
	return <div className={component().base}>Valid Slot Variable</div>;
}

/**
 * ❌ Invalid: Slot with invalid variable value
 * @invalidClasses [invalid-tv-base-var]
 */
export function TvSlotVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const component = tv({
		slots: {
			base: invalidBase
		}
	});
	return <div className={component().base}>Invalid Slot Variable</div>;
}
