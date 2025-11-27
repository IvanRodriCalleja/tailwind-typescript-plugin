import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicate in compoundVariants className property
 * @duplicateClasses [p-4, p-4]
 */
export function CvaDuplicateInCompoundVariantClassName() {
	const button = cva(['p-4', 'm-2'], {
		compoundVariants: [{ className: 'p-4 font-bold' }]
	});
	return <button className={button()}>Compound className duplicate</button>;
}
