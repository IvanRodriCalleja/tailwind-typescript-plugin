/**
 * E2E Test: Duplicate Class Detection in tv()
 * Context: tailwind-variants tv() function
 * Pattern: duplicate (same class appears multiple times)
 *
 * Tests validation of duplicate classes within a single tv() definition.
 * Duplicates are detected across:
 * - base property
 * - variants
 * - compoundVariants
 * - slots
 *
 * Note: Classes are scoped per tv() call - same class in different tv() calls is NOT a duplicate.
 */
import { tv } from 'tailwind-variants';

// ========================================
// DUPLICATES WITHIN BASE
// ========================================

/**
 * ⚠️ Warning: Duplicate in base string
 * @duplicateClasses [flex]
 */
export function TvDuplicateInBase() {
	const button = tv({
		base: 'flex flex items-center'
	});
	return <button className={button()}>Duplicate in base</button>;
}

/**
 * ⚠️ Warning: Duplicate in base array
 * @duplicateClasses [flex]
 */
export function TvDuplicateInBaseArray() {
	const button = tv({
		base: ['flex', 'flex', 'items-center']
	});
	return <button className={button()}>Duplicate in base array</button>;
}

// ========================================
// DUPLICATES ACROSS BASE AND VARIANTS
// ========================================

/**
 * ⚠️ Warning: Class in base repeated in variant
 * @duplicateClasses [flex]
 * The second 'flex' in the variant should show warning
 */
export function TvDuplicateBaseAndVariant() {
	const button = tv({
		base: 'flex items-center',
		variants: {
			size: {
				sm: 'flex text-sm'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>Duplicate base + variant</button>;
}

/**
 * ⚠️ Warning: Multiple duplicates across base and variants
 * @duplicateClasses [flex, items-center]
 */
export function TvMultipleDuplicatesAcrossVariants() {
	const button = tv({
		base: 'flex items-center p-4',
		variants: {
			size: {
				sm: 'flex text-sm',
				lg: 'items-center text-lg'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>Multiple duplicates</button>;
}

// ========================================
// DUPLICATES IN COMPOUND VARIANTS
// ========================================

/**
 * ⚠️ Warning: Class in base repeated in compoundVariants
 * @duplicateClasses [flex]
 */
export function TvDuplicateInCompoundVariant() {
	const button = tv({
		base: 'flex items-center',
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: 'flex font-bold' }]
	});
	return <button className={button({ color: 'primary', size: 'lg' })}>Compound duplicate</button>;
}

/**
 * ⚠️ Warning: Duplicate in compoundVariants className property
 * @duplicateClasses [p-4]
 */
export function TvDuplicateInCompoundVariantClassName() {
	const button = tv({
		base: 'p-4 m-2',
		compoundVariants: [{ className: 'p-4 font-bold' }]
	});
	return <button className={button()}>Compound className duplicate</button>;
}

// ========================================
// DUPLICATES IN SLOTS
// ========================================

/**
 * ⚠️ Warning: Duplicate within same slot
 * @duplicateClasses [flex]
 */
export function TvDuplicateWithinSlot() {
	const component = tv({
		slots: {
			base: 'flex flex items-center',
			content: 'p-4'
		}
	});
	return <div className={component().base}>Duplicate within slot</div>;
}

/**
 * ⚠️ Warning: Duplicate across slots
 * @duplicateClasses [flex]
 * Note: All slots share the same tv() scope, so duplicates are detected across slots
 */
export function TvDuplicateAcrossSlots() {
	const component = tv({
		slots: {
			base: 'flex items-center',
			icon: 'flex mr-2'
		}
	});
	return <div className={component().base}>Duplicate across slots</div>;
}

// ========================================
// NO DUPLICATES (Valid cases)
// ========================================

/**
 * ✅ Valid: Same class in different tv() calls
 * Each tv() has its own scope
 */
export function TvNoDuplicateDifferentCalls() {
	const button = tv({
		base: 'flex items-center'
	});
	const card = tv({
		base: 'flex justify-center'
	});
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
export function TvNoDuplicates() {
	const button = tv({
		base: 'flex items-center justify-between',
		variants: {
			size: {
				sm: 'text-sm px-2 py-1',
				lg: 'text-lg px-4 py-2'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>No duplicates</button>;
}

/**
 * ✅ Valid: Similar but different classes
 */
export function TvSimilarButDifferent() {
	const button = tv({
		base: 'p-4 pt-2 px-6 py-3'
	});
	return <button className={button()}>Similar classes</button>;
}
