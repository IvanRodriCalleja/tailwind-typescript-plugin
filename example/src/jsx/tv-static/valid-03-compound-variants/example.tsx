import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Compound variants with valid classes
 * @validClasses [font-bold, text-xl]
 */
export function TvCompoundVariantsValid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: 'font-bold text-xl' }]
	});
	return <button className={button({ color: 'primary', size: 'lg' })}>Valid Compound</button>;
}
