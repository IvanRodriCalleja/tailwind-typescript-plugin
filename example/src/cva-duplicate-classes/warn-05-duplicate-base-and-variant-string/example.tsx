import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicate with string syntax in variants
 * @duplicateClasses [items-center, items-center]
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
