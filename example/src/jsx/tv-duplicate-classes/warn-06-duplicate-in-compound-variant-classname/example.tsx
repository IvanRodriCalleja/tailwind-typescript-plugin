import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Duplicate in compoundVariants className property
 * @duplicateClasses [p-4, p-4]
 */
export function TvDuplicateInCompoundVariantClassName() {
	const button = tv({
		base: 'p-4 m-2',
		compoundVariants: [{ className: 'p-4 font-bold' }]
	});
	return <button className={button()}>Compound className duplicate</button>;
}
