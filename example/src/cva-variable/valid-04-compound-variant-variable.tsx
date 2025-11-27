import { cva } from 'class-variance-authority';

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
	return (
		<button className={button({ color: 'primary', size: 'lg' })}>Valid Compound Variable</button>
	);
}
