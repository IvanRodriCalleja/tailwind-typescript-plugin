import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Class in base repeated in compoundVariants
 * @duplicateClasses [flex, flex]
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
