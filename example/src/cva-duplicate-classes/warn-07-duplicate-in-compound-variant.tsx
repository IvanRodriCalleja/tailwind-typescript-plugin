import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Class in base repeated in compoundVariants
 * @duplicateClasses [flex, flex]
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
