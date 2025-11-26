/**
 * E2E Test: Duplicate Class Detection in cva()
 * Context: class-variance-authority cva() function
 * Pattern: duplicate (same class appears multiple times)
 *
 * Tests validation of duplicate classes within a single cva() definition.
 * Duplicates are detected across:
 * - base (first argument - string or array)
 * - variants
 * - compoundVariants
 *
 * Note: Classes are scoped per cva() call - same class in different cva() calls is NOT a duplicate.
 */
import { cva } from 'class-variance-authority';

// ========================================
// DUPLICATES WITHIN BASE
// ========================================

/**
 * ⚠️ Warning: Duplicate in base string
 * @duplicateClasses [flex]
 */
export function CvaDuplicateInBaseString() {
	const button = cva('flex flex items-center');
	return <button className={button()}>Duplicate in base string</button>;
}

/**
 * ⚠️ Warning: Duplicate in base array
 * @duplicateClasses [flex]
 */
export function CvaDuplicateInBaseArray() {
	const button = cva(['flex', 'flex', 'items-center']);
	return <button className={button()}>Duplicate in base array</button>;
}

/**
 * ⚠️ Warning: Multiple duplicates in base
 * @duplicateClasses [flex, p-4]
 */
export function CvaMultipleDuplicatesInBase() {
	const button = cva(['flex', 'p-4', 'flex', 'p-4', 'items-center']);
	return <button className={button()}>Multiple duplicates in base</button>;
}

// ========================================
// DUPLICATES ACROSS BASE AND VARIANTS
// ========================================

/**
 * ⚠️ Warning: Class in base repeated in variant
 * @duplicateClasses [flex]
 */
export function CvaDuplicateBaseAndVariant() {
	const button = cva(['flex', 'items-center'], {
		variants: {
			intent: {
				primary: ['flex', 'bg-blue-500']
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Duplicate base + variant</button>;
}

/**
 * ⚠️ Warning: Duplicate with string syntax in variants
 * @duplicateClasses [items-center]
 */
export function CvaDuplicateBaseAndVariantString() {
	const button = cva('flex items-center', {
		variants: {
			size: {
				sm: 'items-center text-sm'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>Duplicate string variant</button>;
}

/**
 * ⚠️ Warning: Duplicates across multiple variants
 * @duplicateClasses [flex]
 */
export function CvaDuplicateAcrossVariants() {
	const button = cva(['flex'], {
		variants: {
			intent: {
				primary: 'bg-blue-500'
			},
			size: {
				lg: 'flex text-lg'
			}
		}
	});
	return <button className={button({ intent: 'primary', size: 'lg' })}>Cross-variant duplicate</button>;
}

// ========================================
// DUPLICATES IN COMPOUND VARIANTS
// ========================================

/**
 * ⚠️ Warning: Class in base repeated in compoundVariants
 * @duplicateClasses [flex]
 */
export function CvaDuplicateInCompoundVariant() {
	const button = cva(['flex', 'items-center'], {
		variants: {
			intent: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ intent: 'primary', size: 'lg', class: 'flex font-bold' }]
	});
	return <button className={button({ intent: 'primary', size: 'lg' })}>Compound duplicate</button>;
}

/**
 * ⚠️ Warning: Duplicate in compoundVariants className property
 * @duplicateClasses [p-4]
 */
export function CvaDuplicateInCompoundVariantClassName() {
	const button = cva(['p-4', 'm-2'], {
		compoundVariants: [{ className: 'p-4 font-bold' }]
	});
	return <button className={button()}>Compound className duplicate</button>;
}

/**
 * ⚠️ Warning: Duplicate across multiple compoundVariants
 * @duplicateClasses [font-bold]
 */
export function CvaDuplicateAcrossCompoundVariants() {
	const button = cva(['flex'], {
		compoundVariants: [
			{ intent: 'primary', class: 'font-bold' },
			{ intent: 'secondary', class: 'font-bold italic' }
		]
	});
	return <button className={button()}>Duplicate across compounds</button>;
}

// ========================================
// DUPLICATES WITHIN SAME VARIANT OPTION
// ========================================

/**
 * ⚠️ Warning: Duplicate within same variant value
 * @duplicateClasses [bg-blue-500]
 */
export function CvaDuplicateWithinVariant() {
	const button = cva('flex', {
		variants: {
			intent: {
				primary: 'bg-blue-500 bg-blue-500 text-white'
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Duplicate within variant</button>;
}

// ========================================
// NO DUPLICATES (Valid cases)
// ========================================

/**
 * ✅ Valid: Same class in different cva() calls
 * Each cva() has its own scope
 */
export function CvaNoDuplicateDifferentCalls() {
	const button = cva(['flex', 'items-center']);
	const card = cva(['flex', 'justify-center']);
	return (
		<>
			<button className={button()}>Button</button>
			<div className={card()}>Card</div>
		</>
	);
}

/**
 * ✅ Valid: All unique classes
 */
export function CvaNoDuplicates() {
	const button = cva(['flex', 'items-center', 'justify-between'], {
		variants: {
			size: {
				sm: ['text-sm', 'px-2', 'py-1'],
				lg: ['text-lg', 'px-4', 'py-2']
			}
		}
	});
	return <button className={button({ size: 'sm' })}>No duplicates</button>;
}

/**
 * ✅ Valid: Similar but different classes
 */
export function CvaSimilarButDifferent() {
	const button = cva(['p-4', 'pt-2', 'px-6', 'py-3']);
	return <button className={button()}>Similar classes</button>;
}

/**
 * ✅ Valid: Boolean variants with null
 */
export function CvaBooleanVariantsNoNull() {
	const button = cva(['flex'], {
		variants: {
			disabled: {
				true: 'opacity-50 cursor-not-allowed',
				false: null
			}
		}
	});
	return <button className={button({ disabled: true })}>Boolean variant</button>;
}
