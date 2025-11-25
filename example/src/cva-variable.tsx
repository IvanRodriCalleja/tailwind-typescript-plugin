/**
 * Test: Variables used inside class-variance-authority cva() definitions
 * Pattern: cva(myVar, { variants: { color: { primary: myVar } } })
 */
import { cva } from 'class-variance-authority';

// ========================================
// BASE PROPERTY WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Variable with valid classes in base (string)
 * @validClasses [flex, items-center]
 */
export function CvaBaseVariableStringValid() {
	const validBase = 'flex items-center';
	const button = cva(validBase);
	return <button className={button()}>Valid Base Variable String</button>;
}

/**
 * ❌ Invalid: Variable with invalid class in base (string)
 * @invalidClasses [invalid-cva-base-var]
 */
export function CvaBaseVariableStringInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva(invalidBase);
	return <button className={button()}>Invalid Base Variable String</button>;
}

/**
 * ❌ Invalid: Variable with mixed valid/invalid classes in base
 * @invalidClasses [invalid-cva-mixed-var]
 * @validClasses [flex, items-center]
 */
export function CvaBaseVariableMixed() {
	const mixedClasses = 'flex invalid-cva-mixed-var items-center';
	const button = cva(mixedClasses);
	return <button className={button()}>Mixed Base Variable</button>;
}

// ========================================
// ARRAY BASE WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Array base with variable element
 * @validClasses [flex, items-center, gap-2]
 */
export function CvaArrayWithVariableValid() {
	const validBase = 'flex items-center';
	const button = cva([validBase, 'gap-2']);
	return <button className={button()}>Valid Array Variable</button>;
}

/**
 * ❌ Invalid: Array base with invalid variable element
 * @invalidClasses [invalid-cva-base-var]
 * @validClasses [gap-2]
 */
export function CvaArrayWithVariableInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva([invalidBase, 'gap-2']);
	return <button className={button()}>Invalid Array Variable</button>;
}

// ========================================
// VARIANTS WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Variable with valid classes in variant
 * @validClasses [bg-blue-500, hover:bg-blue-700]
 */
export function CvaVariantVariableValid() {
	const validVariant = 'bg-blue-500 hover:bg-blue-700';
	const button = cva(['font-semibold'], {
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
 * @invalidClasses [invalid-cva-variant-var]
 */
export function CvaVariantVariableInvalid() {
	const invalidVariant = 'invalid-cva-variant-var';
	const button = cva(['font-semibold'], {
		variants: {
			color: {
				primary: invalidVariant
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Variant Variable</button>;
}

/**
 * ❌ Invalid: Array variant with invalid variable element
 * @invalidClasses [invalid-cva-variant-var]
 * @validClasses [text-sm]
 */
export function CvaArrayVariantWithVariableInvalid() {
	const invalidVariant = 'invalid-cva-variant-var';
	const button = cva(['font-semibold'], {
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
export function CvaCompoundVariantVariableValid() {
	const validBase = 'flex items-center';
	const button = cva(['font-semibold'], {
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: validBase }]
	});
	return <button className={button({ color: 'primary', size: 'lg' })}>Valid Compound Variable</button>;
}

/**
 * ❌ Invalid: Compound variant with invalid variable class
 * @invalidClasses [invalid-cva-base-var]
 */
export function CvaCompoundVariantVariableInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva(['font-semibold'], {
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: invalidBase }]
	});
	return <button className={button({ color: 'primary' })}>Invalid Compound Variable</button>;
}

// ========================================
// BOOLEAN VARIANTS WITH VARIABLES
// ========================================

/**
 * ✅ Valid: Boolean variant with variable for true
 * @validClasses [flex, items-center]
 */
export function CvaBooleanVariantVariableValid() {
	const validBase = 'flex items-center';
	const button = cva(['font-semibold'], {
		variants: {
			active: {
				false: null,
				true: validBase
			}
		}
	});
	return <button className={button({ active: true })}>Valid Boolean Variable</button>;
}

/**
 * ❌ Invalid: Boolean variant with invalid variable for true
 * @invalidClasses [invalid-cva-base-var]
 */
export function CvaBooleanVariantVariableInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva(['font-semibold'], {
		variants: {
			active: {
				false: null,
				true: invalidBase
			}
		}
	});
	return <button className={button({ active: true })}>Invalid Boolean Variable</button>;
}
